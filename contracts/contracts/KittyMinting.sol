//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "./KittyAuction.sol";

/// @title all functions related to creating kittens
contract KittyMinting is KittyAuction {

    // Limits the number of cats the contract owner can ever create.
    uint256 public constant PROMO_CREATION_LIMIT = 5000;
    uint256 public constant GEN0_CREATION_LIMIT = 45000;

    // Constants for gen0 auctions.
    uint256 public constant GEN0_STARTING_PRICE = 0.001 ether;
    uint256 public constant GEN0_AUCTION_DURATION = 1 days;

    // Counts the number of cats the contract owner has created.
    uint256 public promoCreatedCount;
    uint256 public gen0CreatedCount;

    /// @dev we can create promo kittens, up to a limit. Only callable by COO
    /// @param _genes the encoded genes of the kitten to be created, any value is accepted
    /// @param _owner the future owner of the created kittens. Default to contract COO
    function createPromoKitty(uint256 _genes, address _owner) external onlyCOO {
        address kittyOwner = _owner;
        if (kittyOwner == address(0)) {
             kittyOwner = cooAddress;
        }
        require(promoCreatedCount < PROMO_CREATION_LIMIT);

        promoCreatedCount++;

        _createKitty(0, 0, 0, modifyGene(_genes), kittyOwner);
    }

    function modifyGene(uint256 genes) public view returns (uint256) {
        uint256 mainGenes = genes >> 16; // Shift right to remove the last 16 bits (4 bits per chain ID * 4)
        mainGenes = mainGenes << 16; // Shift left to restore to original size, but with last 16 bits cleared

        // Get current chain ID and three other random chain IDs
        uint8 currentChainID = uint8(block.chainid);
        uint8[] memory randomChainIDs = new uint8[](3);
        randomChainIDs[0] = 0;
        randomChainIDs[1] = 1;
        randomChainIDs[2] = 2;

        uint8 index = 0;
        for (uint i = 0; i < chainIDs.length; i++){
            if (chainIDs[i] == currentChainID) {
                index = uint8(i);
                break;
            }
        }

        // Append chain IDs to the main genes
        uint256 newGenes = mainGenes;
        newGenes |= (index << (4 * 3));
        for (uint i = 0; i < 3; i++) {
            newGenes |= (uint256(randomChainIDs[i]) << (4 * i));
        }

        return newGenes;
    }

    /// @dev Creates a new gen0 kitty with the given genes and
    ///  creates an auction for it.
    function createGen0Auction(uint256 _genes) external onlyCOO {
        require(gen0CreatedCount < GEN0_CREATION_LIMIT);

        uint256 kittyId = _createKitty(0, 0, 0, _genes, address(this));
        _approve(kittyId, address(saleAuction));

        saleAuction.createAuction(
            kittyId,
            _computeNextGen0Price(),
            0,
            GEN0_AUCTION_DURATION,
            address(this)
        );

        gen0CreatedCount++;
    }

    /// @dev Computes the next gen0 auction starting price, given
    ///  the average of the past 5 prices + 50%.
    function _computeNextGen0Price() internal view returns (uint256) {
        uint256 avePrice = saleAuction.averageGen0SalePrice();

        // Sanity check to ensure we don't overflow arithmetic
        require(avePrice == uint256(uint128(avePrice)));

        uint256 nextPrice = avePrice + (avePrice / 2);

        // We never auction for less than starting price
        if (nextPrice < GEN0_STARTING_PRICE) {
            nextPrice = GEN0_STARTING_PRICE;
        }

        return nextPrice;
    }
}