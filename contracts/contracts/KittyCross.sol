//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "./KittyBase.sol";

contract KittyCross is KittyBase {

    mapping (uint256 => address) crossContractAddresses;

    uint256[] chainIDs;

    function setAddress(uint256 chainID, address contractAddress) public onlyCEO{
        crossContractAddresses[chainID] = contractAddress;
    }

    function addChain(uint256 chainID, address contractAddress) external onlyCEO{
        chainIDs.push(chainID);
        setAddress(chainID, contractAddress);
    }

}