//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "./CrossMessenger.sol";

contract KittyCross is CrossMessenger {

    struct Permitted {
        uint256 chainID;
        address approvedAddress;
    }

    /// @dev A mapping from KittyIDs to an address that has been approved to use
    ///  this Kitty for siring via breedWith(). Each Kitty can only have one approved
    ///  address for siring at any time. A zero value means no approval is outstanding.
    mapping (uint256 => Permitted) public sireAllowedToAddress;

    mapping (uint256 => address) crossContractAddresses;

    /// @dev A kitty is blocked when cross-chain breeding is in process and a message is sent
    ///      It will be unblocked once the callback is successful
    mapping (uint256 => bool) isKittyCrossBlocked;

    struct CrossSireData {
        uint256 sireId;
        uint256 sireChainId;
        uint16 generation;
        uint256 genes;
    }

    mapping(uint256 => CrossSireData) public crossSireData;

    uint256[] chainIDs;

    modifier onlyUnblocked(uint256 id) {
        require(!isKittyCrossBlocked[id], "This kitten is currently blocked!");
        _;
    }

    function blockKittyForCrossCall(uint256 id) internal {
        isKittyCrossBlocked[id] = true;
    }

    function unblockKittyForCrossCall(uint256 id) internal {
        isKittyCrossBlocked[id] = false;
    }

    function setAddress(uint256 chainID, address contractAddress) public onlyCEO{
        crossContractAddresses[chainID] = contractAddress;
    }

    function addChain(uint256 chainID, address contractAddress) external onlyCEO{
        chainIDs.push(chainID);
        setAddress(chainID, contractAddress);
    }

    function getChainIDLength() external view returns (uint256) {
        return chainIDs.length;
    }

    function getChainIDByIndex(uint256 index) external view returns (uint256){
        return chainIDs[index];
    }
}