//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "./KittyBase.sol";

contract KittyCross is KittyBase {

    struct Approved {
        uint256 chainID;
        address appAddress;
    }

    /// @dev A mapping from KittyIDs to an address that has been approved to use
    ///  this Kitty for siring via breedWith(). Each Kitty can only have one approved
    ///  address for siring at any time. A zero value means no approval is outstanding.
    mapping (uint256 => Approved) public sireAllowedToAddress;

    mapping (uint256 => address) crossContractAddresses;

    /// @dev A kitty is blocked when cross-chain breeding is in process and a message is sent
    ///      It will be unblocked once the callback is successful
    mapping (uint256 => bool) isBlocked;

    uint256[] chainIDs;

    modifier onlyUnblocked(uint256 id) {
        require(!isBlocked[id], "This kitten is currently blocked!");

        _;
    }

    function setAddress(uint256 chainID, address contractAddress) public onlyCEO{
        crossContractAddresses[chainID] = contractAddress;
    }

    function addChain(uint256 chainID, address contractAddress) external onlyCEO{
        chainIDs.push(chainID);
        setAddress(chainID, contractAddress);
    }

}