//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "./ArbitrumCrossGeneScienceInterface.sol";
import "@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol";

interface KittyCoreInterface{
    function cooAddress() external returns(address);

    function getChainIDLength() external view returns (uint256);

    function getChainIDByIndex(uint256 index) external view returns (uint256);

}

/// @title GeneScience implements the trait calculation for new kitties
/// @author Axiom Zen, Dieter Shirley <dete@axiomzen.co> (https://github.com/dete), Fabiano P. Soriani <fabianosoriani@gmail.com> (https://github.com/flockonus), Jordan Schalm <jordan.schalm@gmail.com> (https://github.com/jordanschalm), Abhishek Chadha <abhishek@dapperlabs.com> (https://github.com/achadha235)
contract ArbitrumCrossGeneScience is VRFV2WrapperConsumerBase, ArbitrumCrossGeneScienceInterface {

    struct ChainLinkRandomNumber {
        uint256 randomness;
        uint256 kittyID;
        bool used;
        bool ready;
    }

    /// @dev mapping from requestID to the random number. Can only be used exactly once.
    mapping (uint256 => ChainLinkRandomNumber) public randomNumbers;
    /// @dev mapping from kittyID to requestID. Should prevent the user from being able to generate randomness again.
    mapping (uint256 => uint256) public randomnessGenerated;

    uint256 internal constant maskLast8Bits = uint256(0xff);
    uint256 internal constant maskFirst248Bits = uint256(~uint256(0xff));

    // This is the privileged birther address. If this is set to 0, privileged birthing is disabled
    address internal _privilegedBirther;
    // Privileged window size for birthers, set to 5 blocks.
    uint256 public privilegedBirtherWindowSize = 5;
    KittyCoreInterface _kittyCore;

    uint256 internal fee;

    constructor(address _privilegedBirtherAddress, address _kittyCoreAddress) 
        VRFV2WrapperConsumerBase(
            0xd14838A68E8AFBAdE5efb411d5871ea0011AFd28, // LINK Token
            0x674Cda1Fef7b3aA28c535693D658B42424bb7dBD
        )
    {
        require(_kittyCoreAddress != address(0));
        _kittyCore = KittyCoreInterface(_kittyCoreAddress);
        _privilegedBirther = _privilegedBirtherAddress;

        fee = 0.25 * 10**18;
    }


    function generateRandomness(uint _kittyID) external {
        require(
            msg.sender == address(_kittyCore),
            "Can only be called from Kitty contract!"
        );

        require(
            LINK.balanceOf(address(this)) > fee,
            "Not enough LINK - fill contract with faucet"
        );

        require(
            randomnessGenerated[_kittyID] == 0 ||
            randomNumbers[randomnessGenerated[_kittyID]].used,
            "Your kitty hasn't used the generated randomness yet!"
        );

        uint256 requestId = requestRandomness(
            100000,
            3,
            1
        );

        randomNumbers[requestId] = ChainLinkRandomNumber({
            randomness: 0,
            kittyID: _kittyID,
            used: false,
            ready: false
        });

        randomnessGenerated[_kittyID] = requestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        uint256 number = _randomWords[0];

        randomNumbers[_requestId].randomness = number;
        randomNumbers[_requestId].ready = true;
    }

    function isGeneScience() public override pure returns (bool) {
        return true;
    }

    /// @dev set the privileged birther address
    /// @param _birtherAddress the new birther address
    function setPrivilegedBirther(address _birtherAddress) public {
        require(msg.sender == _kittyCore.cooAddress());
        _privilegedBirther = _birtherAddress;
    }

    /// @dev given a characteristic and 2 genes (unsorted) - returns > 0 if the genes ascended, that's the value
    /// @param trait1 any trait of that characteristic
    /// @param trait2 any trait of that characteristic
    /// @param rand is expected to be a 3 bits number (0~7)
    /// @return ascension if didnt match any ascention, OR a number from 0 to 30 for the ascended trait
    function _ascend(uint8 trait1, uint8 trait2, uint256 rand) internal pure returns(uint8 ascension) {
        ascension = 0;

        uint8 smallT = trait1;
        uint8 bigT = trait2;

        if (smallT > bigT) {
            bigT = trait1;
            smallT = trait2;
        }

        // https://github.com/axiomzen/cryptokitties/issues/244
        if ((bigT - smallT == 1) && smallT % 2 == 0) {

            // The rand argument is expected to be a random number 0-7.
            // 1st and 2nd tier: 1/4 chance (rand is 0 or 1)
            // 3rd and 4th tier: 1/8 chance (rand is 0)

            // must be at least this much to ascend
            uint256 maxRand;
            if (smallT < 23) maxRand = 1;
            else maxRand = 0;

            if (rand <= maxRand ) {
                ascension = (smallT / 2) + 16;
            }
        }
    }

    /// @dev given a number get a slice of any bits, at certain offset
    /// @param _n a number to be sliced
    /// @param _nbits how many bits long is the new number
    /// @param _offset how many bits to skip
    function _sliceNumber(uint256 _n, uint256 _nbits, uint256 _offset) private pure returns (uint256) {
        // mask is made by shifting left an offset number of times
        uint256 mask = uint256((2**_nbits) - 1) << _offset;
        // AND n with mask, and trim to max of _nbits bits
        return uint256((_n & mask) >> _offset);
    }

    /// @dev Get a 5 bit slice from an input as a number
    /// @param _input bits, encoded as uint
    /// @param _slot from 0 to 50
    function _get5Bits(uint256 _input, uint256 _slot) internal pure returns(uint8) {
        return uint8(_sliceNumber(_input, uint256(5), _slot * 5));
    }

    function _get4Bits(uint256 _input, uint256 _slot) internal pure returns(uint8) {
        return uint8(_sliceNumber(_input, uint256(4), _slot * 4));
    }

    /// @dev Parse a kitten gene and returns all of 12 "trait stack" that makes the characteristics
    /// @param _genes kitten gene
    /// @return the 48 traits that composes the genetic code, logically divided in stacks of 4, where only the first trait of each stack may express
    function decode(uint256 _genes) public pure returns(uint8[] memory) {
        uint8[] memory traits = new uint8[](52);
        uint256 i;
        for(i = 0; i < 52; i++) {
            if (i < 48) {
                traits[i] = _get5Bits(_genes, i);
            } else {
                traits[i] = _get4Bits(_genes, i); // Add a new function to get 4 bits
            }
        }
        return traits;
    }

    /// @dev returns the "visible" chainID index that the kitty will be on.
    /// @return index of chainID that the kitty will live on
    function decodeChainID(uint256 _genes) public view override returns(uint) {
        uint index = _get4Bits(_genes, 48) % _kittyCore.getChainIDLength();
        return _kittyCore.getChainIDByIndex(index);
    }

    function encode(uint8[] memory _traits) public pure returns (uint256 _genes) {
        _genes = 0;
        for(uint256 i = 0; i < 52; i++) {
            if (i < 48) {
                _genes = _genes << 5;
                _genes = _genes | _traits[47 - i];
            } else {
                _genes = _genes << 4;
                _genes = _genes | _traits[51 - i]; // Encode the new 4-bit traits
            }
        }
        return _genes;
    }

    /// @dev return the expressing traits
    /// @param _genes the long number expressing cat genes
    function expressingTraits(uint256 _genes) public pure returns(uint8[12] memory) {
        uint8[12] memory express;
        for(uint256 i = 0; i < 12; i++) {
            express[i] = _get5Bits(_genes, i * 4);
        }
        return express;
    }

    /// @dev randomness for a kittyID must have been generated and not used yet before calling this function
    function mixGenes(uint256 _genes1, uint256 _genes2, uint256 _targetBlock, uint256 kittyID) public override returns (uint256) {
        if (_privilegedBirther == address(0) || tx.origin == _privilegedBirther) {
            // Allow immediate births if there is no privileged birther, or if the originator
            // of the transaction is the privileged birther
            require(block.number > _targetBlock);
        } else {
            require(block.number > _targetBlock + privilegedBirtherWindowSize);
        }
        
        uint requestID = randomnessGenerated[kittyID];

        require(
            !randomNumbers[requestID].used &&
            randomNumbers[requestID].ready,
            "Your random number was already used or is not ready yet!"
        );

        randomNumbers[requestID].used = true;

        uint randomN = randomNumbers[requestID].randomness;

        if (randomN == 0) {
            // We don't want to completely bail if the target block is no-longer available,
            // nor do we want to just use the current block's hash (since it could allow a
            // caller to game the random result). Compute the most recent block that has the
            // the same value modulo 256 as the target block. The hash for this block will
            // still be available, and – while it can still change as time passes – it will
            // only change every 40 minutes. Again, someone is very likely to jump in with
            // the giveBirth() call before it can cycle too many times.
            _targetBlock = (block.number & maskFirst248Bits) + (_targetBlock & maskLast8Bits);

            // The computation above could result in a block LARGER than the current block,
            // if so, subtract 256.
            if (_targetBlock >= block.number) _targetBlock -= 256;

            randomN = uint256(blockhash(_targetBlock));

            // DEBUG ONLY
            // assert(block.number != _targetBlock);
            // assert((block.number - _targetBlock) <= 256);
            // assert(randomN != 0);
        }

        // generate 256 bits of random, using as much entropy as we can from
        // sources that can't change between calls.
        randomN = uint256(keccak256(abi.encode(randomN, _genes1, _genes2, _targetBlock)));
        uint256 randomIndex = 0;

        uint8[] memory genes1Array = decode(_genes1);
        uint8[] memory genes2Array = decode(_genes2);
        // All traits that will belong to baby
        uint8[] memory babyArray = new uint8[](52);
        // A pointer to the trait we are dealing with currently
        uint256 traitPos;
        // Trait swap value holder
        uint8 swap;
        uint256 rand;
        // iterate all 12 characteristics
        for(uint256 i = 0; i < 12; i++) {
            // pick 4 traits for characteristic i
            uint256 j;
            // store the current random value
            for(j = 3; j >= 1; j--) {
                traitPos = (i * 4) + j;

                rand = _sliceNumber(randomN, 2, randomIndex); // 0~3
                randomIndex += 2;

                // 1/4 of a chance of gene swapping forward towards expressing.
                if (rand == 0) {
                    // do it for parent 1
                    swap = genes1Array[traitPos];
                    genes1Array[traitPos] = genes1Array[traitPos - 1];
                    genes1Array[traitPos - 1] = swap;

                }

                rand = _sliceNumber(randomN, 2, randomIndex); // 0~3
                randomIndex += 2;

                if (rand == 0) {
                    // do it for parent 2
                    swap = genes2Array[traitPos];
                    genes2Array[traitPos] = genes2Array[traitPos - 1];
                    genes2Array[traitPos - 1] = swap;
                }
            }

        }

        // DEBUG ONLY - We should have used 72 2-bit slices above for the swapping
        // which will have consumed 144 bits.
        // assert(randomIndex == 144);

        // We have 256 - 144 = 112 bits of randomness left at this point. We will use up to
        // four bits for the first slot of each trait (three for the possible ascension, one
        // to pick between mom and dad if the ascension fails, for a total of 48 bits. The other
        // traits use one bit to pick between parents (36 gene pairs, 36 genes), leaving us
        // well within our entropy budget.

        // done shuffling parent genes, now let's decide on choosing trait and if ascending.
        // NOTE: Ascensions ONLY happen in the "top slot" of each characteristic. This saves
        //  gas and also ensures ascensions only happen when they're visible.
        for(traitPos = 0; traitPos < 48; traitPos++) {

            // See if this trait pair should ascend
            uint8 ascendedTrait = 0;

            // There are two checks here. The first is straightforward, only the trait
            // in the first slot can ascend. The first slot is zero mod 4.
            //
            // The second check is more subtle: Only values that are one apart can ascend,
            // which is what we check inside the _ascend method. However, this simple mask
            // and compare is very cheap (9 gas) and will filter out about half of the
            // non-ascending pairs without a function call.
            //
            // The comparison itself just checks that one value is even, and the other
            // is odd.
            if ((traitPos % 4 == 0) && (genes1Array[traitPos] & 1) != (genes2Array[traitPos] & 1)) {
                rand = _sliceNumber(randomN, 3, randomIndex);
                randomIndex += 3;

                ascendedTrait = _ascend(genes1Array[traitPos], genes2Array[traitPos], rand);
            }

            if (ascendedTrait > 0) {
                babyArray[traitPos] = uint8(ascendedTrait);
            } else {
                // did not ascend, pick one of the parent's traits for the baby
                // We use the top bit of rand for this (the bottom three bits were used
                // to check for the ascension itself).
                rand = _sliceNumber(randomN, 1, randomIndex);
                randomIndex += 1;

                if (rand == 0) {
                    babyArray[traitPos] = uint8(genes1Array[traitPos]);
                } else {
                    babyArray[traitPos] = uint8(genes2Array[traitPos]);
                }
            }
        }

        // Chain ID trait mixing
        for (uint256 i = 48; i < 52; i++) {
            // Mutation: Assign a new chain ID from the registered IDs with increased chance
            rand = _sliceNumber(randomN, 100, randomIndex); // Using 100 to represent percentage
            randomIndex += 100;
            if (rand < 70 && _kittyCore.getChainIDLength() > 0) { // Increased mutation chance
                uint256 newChainIdIndex = _sliceNumber(randomN, _calculateBitsForChainID(), randomIndex) % _kittyCore.getChainIDLength();
                randomIndex += _calculateBitsForChainID();
                babyArray[i] = uint8(newChainIdIndex);
            } else {
                // Inherit chain ID from one of the parents
                rand = _sliceNumber(randomN, 1, randomIndex);
                randomIndex += 1;
                babyArray[i] = (rand == 0) ? genes1Array[i] : genes2Array[i];
            }
        }


        return encode(babyArray);
    }

    // Calculate the number of bits needed to represent the chainID array length
    function _calculateBitsForChainID() internal view returns (uint256) {
        uint256 bits = 0;
        uint256 value = _kittyCore.getChainIDLength();
        while (value > 0) {
            bits++;
            value = value >> 1;
        }
        return bits;
    }
}