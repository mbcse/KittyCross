//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "./KittyERC721.sol";
import "./CrossGeneScienceInterface.sol";

//Hyperlane Recieve interface
interface IMessageRecipient {
    /**
     * @notice Handle an interchain message
     * @param _origin Domain ID of the chain from which the message came
     * @param _sender Address of the message sender on the origin chain as bytes32
     * @param _body Raw bytes content of message body
     */
    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes calldata _body
    ) external payable;
}


/// @title A facet of KittyCore that manages Kitty siring, breeding, and birth.
/// @author Adrian Koegl, Mohit Bhat
contract KittyBreeding is KittyERC721, IMessageRecipient {

    /// @dev The Pregnant event is fired when two cats successfully breed and the pregnancy
    ///  timer begins for the matron.
    event Pregnant(address owner, uint256 matronId, uint256 sireId, uint256 cooldownEndBlock);

    /// @dev whenever a kitty is born, regardless of the destination chain, this event will be emitted
    event KittyBorn(uint256 matronId, uint256 sireId, uint256 matronChainId, uint256 sireChainId, uint256 kittyChainId, uint256 childGenes, address owner);

    /// @dev this event will be emitted when the sire cannot breed and breeding is reverted in the matron
    event BreedingReverted(uint256 matronId, uint256 sireId, uint256 sireChainId);

    event Approved(address addr, uint sireID, uint chainID);

    /// @notice The minimum payment required to use breedWithAuto(). This fee goes towards
    ///  the gas cost paid by whatever calls giveBirth().
    uint256 public autoBirthFee = 0 ether;

    // Keeps track of number of pregnant kitties.
    uint256 public pregnantKitties;

    /// @dev The address of the sibling contract that is used to implement the genetic combination algorithm.
    CrossGeneScienceInterface public geneScience;

    /// @dev Update the address of the genetic contract, can only be called by the CEO.
    /// @param _address An address of a GeneScience contract instance to be used from this point forward.
    function setGeneScienceAddress(address _address) external onlyCEO {
        CrossGeneScienceInterface candidateContract = CrossGeneScienceInterface(_address);

        require(candidateContract.isGeneScience());

        // Set the new contract address
        geneScience = candidateContract;
    }

    /// @dev Checks that a given kitten is able to breed. Requires that the
    ///  current cooldown is finished (for sires) and also checks that there is
    ///  no pending pregnancy.
    function _isReadyToBreed(Kitty memory _kit) internal view returns (bool) {
        // In addition to checking the cooldownEndBlock, we also need to check to see if
        // the cat has a pending birth; there can be some period of time between the end
        // of the pregnacy timer and the birth event.
        return (_kit.siringWithId == 0) && (_kit.cooldownEndBlock <= uint64(block.number));
    }

    /// @dev Check if a sire has authorized breeding with this matron. True if both sire
    ///  and matron have the same owner, or if the sire has given siring permission to
    ///  the matron's owner (via approveSiring()).
    function _isSiringPermitted(uint256 _sireId, uint256 _matronId) internal view returns (bool) {
        address matronOwner = kittyIndexToOwner[_matronId];
        address sireOwner = kittyIndexToOwner[_sireId];

        // Siring is okay if they have same owner, or if the matron's owner was given
        // permission to breed with this sire.
        return (matronOwner == sireOwner || sireAllowedToAddress[_sireId].approvedAddress == matronOwner);
    }

    function _isSiringPermitted(uint256 _sireId, address matronOwner, uint256 _chainId) internal view returns (bool) {
        address sireOwner = kittyIndexToOwner[_sireId];

        // Siring is okay if they have same owner, or if the matron's owner was given
        // permission to breed with this sire.
        return (matronOwner == sireOwner || (sireAllowedToAddress[_sireId].approvedAddress == matronOwner && sireAllowedToAddress[_sireId].chainID == _chainId));
    }

    /// @dev Set the cooldownEndTime for the given Kitty, based on its current cooldownIndex.
    ///  Also increments the cooldownIndex (unless it has hit the cap).
    /// @param _kitten A reference to the Kitty in storage which needs its timer started.
    function _triggerCooldown(Kitty storage _kitten) internal {
        // Compute an estimation of the cooldown time in blocks (based on current cooldownIndex).
        _kitten.cooldownEndBlock = uint64((cooldowns[_kitten.cooldownIndex]/secondsPerBlock) + block.number);

        // Increment the breeding count, clamping it at 13, which is the length of the
        // cooldowns array. We could check the array size dynamically, but hard-coding
        // this as a constant saves gas. Yay, Solidity!
        if (_kitten.cooldownIndex < 13) {
            _kitten.cooldownIndex += 1;
        }
    }

    /// @notice Grants approval to another user to sire with one of your Kitties.
    /// @param _addr The address that will be able to sire with your Kitty. Set to
    ///  address(0) to clear all siring approvals for this Kitty.
    /// @param _sireId A Kitty that you own that _addr will now be able to sire with.
    function approveSiring(address _addr, uint256 _sireId, uint256 chainID)
        external
        whenNotPaused
    {
        require(_owns(msg.sender, _sireId));
        sireAllowedToAddress[_sireId] = Permitted(chainID, _addr);

        emit Approved(_addr, _sireId, chainID);
    }

    /// @dev Updates the minimum payment required for calling giveBirthAuto(). Can only
    ///  be called by the COO address. (This fee is used to offset the gas cost incurred
    ///  by the autobirth daemon).
    function setAutoBirthFee(uint256 val) external onlyCOO {
        autoBirthFee = val;
    }

    /// @dev Checks to see if a given Kitty is pregnant and (if so) if the gestation
    ///  period has passed.
    function _isReadyToGiveBirth(Kitty memory _matron) private view returns (bool) {
        return (_matron.siringWithId != 0) && (_matron.cooldownEndBlock <= uint64(block.number));
    }

    /// @notice Checks that a given kitten is able to breed (i.e. it is not pregnant or
    ///  in the middle of a siring cooldown).
    /// @param _kittyId reference the id of the kitten, any user can inquire about it
    function isReadyToBreed(uint256 _kittyId)
        public
        view
        returns (bool)
    {
        require(_kittyId > 0);
        Kitty storage kit = kitties[_kittyId];
        return _isReadyToBreed(kit);
    }

    /// @dev Checks whether a kitty is currently pregnant.
    /// @param _kittyId reference the id of the kitten, any user can inquire about it
    function isPregnant(uint256 _kittyId)
        public
        view
        returns (bool)
    {
        require(_kittyId > 0);
        // A kitty is pregnant if and only if this field is set
        return kitties[_kittyId].siringWithId != 0;
    }

    /// @dev Internal check to see if a given sire and matron are a valid mating pair. DOES NOT
    ///  check ownership permissions (that is up to the caller).
    /// @param _matron A reference to the Kitty struct of the potential matron.
    /// @param _matronId The matron's ID.
    /// @param _sire A reference to the Kitty struct of the potential sire.
    /// @param _sireId The sire's ID
    function _isValidMatingPair(
        Kitty storage _matron,
        uint256 _matronId,
        Kitty storage _sire,
        uint256 _sireId
    )
        private
        view
        returns(bool)
    {
        // A Kitty can't breed with itself!
        if (_matronId == _sireId) {
            return false;
        }

        // Kitties can't breed with their parents.
        if (_matron.matronId == _sireId || _matron.sireId == _sireId) {
            return false;
        }
        if (_sire.matronId == _matronId || _sire.sireId == _matronId) {
            return false;
        }

        // We can short circuit the sibling check (below) if either cat is
        // gen zero (has a matron ID of zero).
        if (_sire.matronId == 0 || _matron.matronId == 0) {
            return true;
        }

        // Kitties can't breed with full or half siblings.
        if (_sire.matronId == _matron.matronId || _sire.matronId == _matron.sireId) {
            return false;
        }
        if (_sire.sireId == _matron.matronId || _sire.sireId == _matron.sireId) {
            return false;
        }

        // Everything seems cool! Let's get DTF.
        return true;
    }

    /// @dev Internal check to see if a given sire and matron are a valid mating pair for
    ///  breeding via auction (i.e. skips ownership and siring approval checks).
    function _canBreedWithViaAuction(uint256 _matronId, uint256 _sireId)
        internal
        view
        returns (bool)
    {
        Kitty storage matron = kitties[_matronId];
        Kitty storage sire = kitties[_sireId];
        return _isValidMatingPair(matron, _matronId, sire, _sireId);
    }

    /// @notice Checks to see if two cats can breed together, including checks for
    ///  ownership and siring approvals. Does NOT check that both cats are ready for
    ///  breeding (i.e. breedWith could still fail until the cooldowns are finished).
    ///  TODO: Shouldn't this check pregnancy and cooldowns?!?
    /// @param _matronId The ID of the proposed matron.
    /// @param _sireId The ID of the proposed sire.
    function canBreedWith(uint256 _matronId, uint256 _sireId, uint256 _srcChain)
        external
        view
        returns(bool)
    {
        require(_matronId > 0);
        require(_sireId > 0);
        Kitty storage matron = kitties[_matronId];
        Kitty storage sire = kitties[_sireId];
        return _isValidMatingPair(matron, _matronId, sire, _sireId) &&
            _isSiringPermitted(_sireId, _matronId);
    }

    /// @dev Internal utility function to initiate breeding, assumes that all breeding
    ///  requirements have been checked.
    function _breedWith(uint256 _matronId, uint256 _sireId) internal {
        // Grab a reference to the Kitties from storage.
        Kitty storage sire = kitties[_sireId];
        Kitty storage matron = kitties[_matronId];

        // Mark the matron as pregnant, keeping track of who the sire is.
        matron.siringWithId = uint32(_sireId);

        // Trigger the cooldown for both parents.
        _triggerCooldown(sire);
        _triggerCooldown(matron);

        // Clear siring permission for both parents. This may not be strictly necessary
        // but it's likely to avoid confusion!
        delete sireAllowedToAddress[_matronId];
        delete sireAllowedToAddress[_sireId];

        // Every time a kitty gets pregnant, counter is incremented.
        pregnantKitties++;

        // Emit the pregnancy event.
        emit Pregnant(kittyIndexToOwner[_matronId], _matronId, _sireId, matron.cooldownEndBlock);
    }

    /// @notice Have a pregnant Kitty give birth!
    /// @param _matronId A Kitty ready to give birth.
    /// @dev Looks at a given Kitty and, if pregnant and if the gestation period has passed,
    ///  combines the genes of the two parents to create a new kitten. The new Kitty is assigned
    ///  to the current owner of the matron. Upon successful completion, both the matron and the
    ///  new kitten will be ready to breed again. Note that anyone can call this function (if they
    ///  are willing to pay the gas!), but the new kitten always goes to the mother's owner.
    function giveBirth(uint256 _matronId) external whenNotPaused(){
       _giveBirthCrossChain(_matronId);
    }
    
    function _giveBirth(uint256 _matronId)
       internal
    {
        // Grab a reference to the matron in storage.
        Kitty storage matron = kitties[_matronId];

        // Check that the matron is a valid cat.
        require(matron.birthTime != 0);

        // Check that the matron is pregnant, and that its time has come!
        require(_isReadyToGiveBirth(matron));

        // Grab a reference to the sire in storage.
        uint256 sireId = matron.siringWithId;
        Kitty storage sire = kitties[sireId];

        // Determine the higher generation number of the two parents
        uint16 parentGen = matron.generation;
        if (sire.generation > matron.generation) {
            parentGen = sire.generation;
        }

        // Call the sooper-sekret gene mixing operation.
        uint256 childGenes = geneScience.mixGenes(matron.genes, sire.genes, matron.cooldownEndBlock - 1);

        // Make the new kitten!
        address owner = kittyIndexToOwner[_matronId];
        _createKitty(_matronId, matron.siringWithId, parentGen + 1, childGenes, owner);

        // Clear the reference to sire from the matron (REQUIRED! Having siringWithId
        // set is what marks a matron as being pregnant.)
        delete matron.siringWithId;

        // Every time a kitty gives birth counter is decremented.
        pregnantKitties--;

        // Send the balance fee to the person who made birth happen.
        payable(msg.sender).transfer(autoBirthFee);
    }
    
    ///@notice Pregnant matron gives birth, potentially on a different chain
    ///@dev if genetic combination will result in a different chainID, then a cross-chain call to that chain will occur.
    function _giveBirthCrossChain(uint256 _matronId)
        internal
    {
        // Grab a reference to the matron in storage.
        Kitty storage matron = kitties[_matronId];

        // Check that the matron is a valid cat.
        require(matron.birthTime != 0);

        // Check that the matron is pregnant, and that its time has come!
        require(_isReadyToGiveBirth(matron));

        // Grab a reference to the sire in storage.
        uint256 sireId = crossSireData[_matronId].sireChainId == 0 ? matron.siringWithId : crossSireData[_matronId].sireId;

        uint16 sireGeneration = crossSireData[_matronId].sireChainId == 0 ? kitties[sireId].generation : crossSireData[_matronId].generation;

        uint256 sireGenes = crossSireData[_matronId].sireChainId == 0 ? kitties[sireId].genes : crossSireData[_matronId].genes;
        // Kitty storage sire = kitties[sireId];

        // Determine the higher generation number of the two parents
        uint16 parentGen = matron.generation;
        if (sireGeneration > matron.generation) {
            parentGen = sireGeneration;
        }

        // Call the sooper-sekret gene mixing operation.
        uint256 childGenes = geneScience.mixGenes(matron.genes, sireGenes, matron.cooldownEndBlock - 1);
        uint256 newKittyChainId = uint256(geneScience.decodeChainID(childGenes));

        // Make the new kitten!
        address owner = kittyIndexToOwner[_matronId];
        if (newKittyChainId == block.chainid) {
            _createKitty(_matronId, matron.siringWithId, parentGen + 1, childGenes, owner);
        }else{
            bytes memory payload = abi.encode(_matronId, matron.siringWithId, parentGen + 1, childGenes, owner);
            sendCrossMessage(newKittyChainId, crossContractAddresses[newKittyChainId], payload, 'crossCallCreateKitty');
        }
        
        emit KittyBorn(_matronId, sireId, block.chainid, crossSireData[_matronId].sireChainId, newKittyChainId, childGenes, owner);

        // Clear the reference to sire from the matron (REQUIRED! Having siringWithId
        // set is what marks a matron as being pregnant.)
        delete matron.siringWithId;

        delete crossSireData[_matronId];

        // Every time a kitty gives birth counter is decremented.
        pregnantKitties--;


        // Send the balance fee to the person who made birth happen.
        payable(msg.sender).transfer(autoBirthFee);

        // return the new kitten's ID
        // return kittenId;
    }

    /// @notice Initiate breeding from the matron kitty
    /// @dev If the target sire is on another chain, a cross-chain call will be initiated using Hyperlane
    ///     the matron kitty will be locked until callback. If the sire can breed with the matron, the
    ///     callback will finalize the breeding and result in a pregnant matron. Otherwise, the callback will unlock the matron.
    function breedWithAutoCrossChain(uint256 _matronId, uint256 _matronChainId, uint256 _sireId, uint256 _sireChainId)
        external
        payable
        whenNotPaused
        onlyUnblocked(_matronId)
    {
        // Checks for payment.
        require(msg.value >= autoBirthFee);

        // Caller must own the matron.
        require(_owns(msg.sender, _matronId));

        // Grab a reference to the potential matron
        Kitty storage matron = kitties[_matronId];

        // Make sure matron isn't pregnant, or in the middle of a siring cooldown
        require(_isReadyToBreed(matron));
        
        if(_matronChainId == _sireChainId) 
        {
            // Check that matron and sire are both owned by caller, or that the sire
            // has given siring permission to caller (i.e. matron's owner).
            // Will fail for _sireId = 0
            require(_isSiringPermitted(_sireId, _matronId));
            // Grab a reference to the potential sire
            Kitty storage sire = kitties[_sireId];

            // Make sure sire isn't pregnant, or in the middle of a siring cooldown
            require(_isReadyToBreed(sire));

            // Test that these cats are a valid mating pair.
            require(_isValidMatingPair(
                matron,
                _matronId,
                sire,
                _sireId
            ));
            // All checks passed, kitty gets pregnant!
            _breedWith(_matronId, _sireId);
        }else{

            //####### Implement Cross Chain Call
            //####### Check if Sire is approved and ready on the other chain
            bytes memory payload = abi.encode(_matronId, msg.sender, _matronChainId, _sireId);
            blockKittyForCrossCall(_matronId);

            crossSireData[_matronId] = CrossSireData(_sireId, _sireChainId, 0, 0);

            sendCrossMessage(_sireChainId, crossContractAddresses[_sireChainId], payload, 'hasSireApprovedAndReadyCrossCallCheck');
        }
    }



    function _breedWithCrossCallCalback(uint256 _matronId, uint256 _matronChainId, uint256 _sireId, uint256 _sireChainId, uint16 _sireGeneration, uint256 _sireGenes) internal {
        // Grab a reference to the Kitties from storage.
        // Kitty storage sire = kitties[_sireId];
        Kitty storage matron = kitties[_matronId];

        // Mark the matron as pregnant, keeping track of who the sire is.
        matron.siringWithId = uint32(_sireId);

        // Trigger the cooldown for Female parent.
        _triggerCooldown(matron);

        crossSireData[_matronId] = CrossSireData(_sireId, _sireChainId, _sireGeneration, _sireGenes);
        // Every time a kitty gets pregnant, counter is incremented.
        pregnantKitties++;

        // Emit the pregnancy event.
        emit Pregnant(kittyIndexToOwner[_matronId], _matronId, _sireId, matron.cooldownEndBlock);

        //unblock the kitty as state is now finalized
        unblockKittyForCrossCall(_matronId);
    }

    function _failedBreedCrossCallback(uint256 _matronId) internal {
        unblockKittyForCrossCall(_matronId);
        emit BreedingReverted(_matronId, crossSireData[_matronId].sireId, crossSireData[_matronId].sireChainId);
        delete crossSireData[_matronId];
    }


    function _hasSireApprovedAndReadyCrossCallCheck(uint256 _matronId, address _matronOwner, uint256 _matronChainId, uint256 _sireId) internal {
        require(_matronId > 0);
        require(_sireId > 0);
        Kitty storage sire = kitties[_sireId];
        bool isReady = _isSiringPermitted(_sireId, _matronOwner, _matronChainId) && _isReadyToBreed(sire);

        if(isReady) {
            // Trigger the cooldown for Male parent.
            _triggerCooldown(sire);
           delete sireAllowedToAddress[_matronId];
        // Payload to send -> uint256 _matronId, uint256 _matronChainId, uint256 _sireId, uint256 _sireChainId, uint16 _sireGeneration, uint256 _sireGenes
           bytes memory payload = abi.encode(_matronId, _matronChainId, _sireId, block.chainid, sire.generation, sire.genes);
           sendCrossMessage(_matronChainId, crossContractAddresses[_matronChainId], payload, 'breedWithCrossCallCalback');
        } else {
            bytes memory payload = abi.encode(_matronId);
            sendCrossMessage(_matronChainId, crossContractAddresses[_matronChainId], payload, 'failedBreedCrossCallback');
        }
    }

/*****
****************************************** Cross Messenger Receiver ************************************** 
**/    
    function handle(
        uint32 origin,
        bytes32 sender,
        bytes calldata data
    ) external payable virtual override onlyMailbox {
        (string memory routeName, bytes memory payload) = abi.decode(data, (string, bytes));
        if(compare(routeName, 'hasSireApprovedAndReadyCrossCallCheck')){
            (uint256 _matronId, address _matronOwner, uint256 _matronChainId, uint256 _sireId) = abi.decode(payload, (uint256, address, uint256, uint256));
            _hasSireApprovedAndReadyCrossCallCheck(_matronId, _matronOwner, _matronChainId, _sireId);
        }else if(compare(routeName, 'breedWithCrossCallCalback')){
            (uint256 _matronId, uint256 _matronChainId, uint256 _sireId, uint256 _sireChainId, uint16 _sireGeneration, uint256 _sireGenes) = abi.decode(payload, (uint256, uint256, uint256, uint256, uint16, uint256));
            _breedWithCrossCallCalback(_matronId, _matronChainId, _sireId, _sireChainId, _sireGeneration, _sireGenes);
        }else if(compare(routeName, 'failedBreedCrossCallback')){
            (uint256 _matronId) = abi.decode(payload, (uint256));
            _failedBreedCrossCallback(_matronId);
        }else if(compare(routeName, 'crossCallCreateKitty')){
            (uint256 _matronId, uint256 _siringWithId, uint16 _generation, uint256 _genes, address _owner) = abi.decode(payload, (uint256, uint256, uint16, uint256, address));
            _createKitty(_matronId, _siringWithId, _generation, _genes, _owner);
        }
        else{
            revert("Invalid Route");
        }

    }

    function compare(string memory str1, string memory str2) public pure returns (bool) {
        return keccak256(abi.encodePacked(str1)) == keccak256(abi.encodePacked(str2));
    }
}