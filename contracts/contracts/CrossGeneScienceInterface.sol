//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

abstract contract CrossGeneScienceInterface {
    /// @dev simply a boolean to indicate this is the contract we expect to be
    function isGeneScience() public virtual view returns (bool);

    /// @dev given genes of kitten 1 & 2, return a genetic combination - may have a random factor
    /// @param genes1 genes of mom
    /// @param genes2 genes of sire
    /// @return the genes that are supposed to be passed down the child
    function mixGenes(uint256 genes1, uint256 genes2, uint256 targetBlock) public virtual returns (uint256);

    function decodeChainID(uint256 genes) public virtual view returns (uint);
}