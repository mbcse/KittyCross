
interface Kitty {
    // The Kitty's genetic code, represented as a large number.
    // Consider using a BigNumber type for precise representation of uint256.
    genes: number;

    // The timestamp from the block when this cat came into existence.
    birthTime: number;

    // The minimum timestamp after which this cat can engage in breeding activities again.
    // This same timestamp is used for the pregnancy timer (for matrons) as well as the siring cooldown.
    cooldownEndBlock: number;

    // The ID of the parents of this kitty, set to 0 for gen0 cats.
    matronId: number;
    sireId: number;

    // Set to the ID of the sire cat for matrons that are pregnant, zero otherwise.
    siringWithId: number;

    // The current cooldown duration index for this Kitty.
    cooldownIndex: number;

    // The "generation number" of this cat.
    generation: number;
}


type Kitties= Kitty[];

export interface GetKittyDetails {
    isGestating: boolean;
    isReady: boolean;
    cooldownIndex: string;  // uint256 in Solidity is represented as string in TypeScript
    nextActionAt: string;   // uint256
    siringWithId: string;   // uint256
    birthTime: string;      // uint256
    matronId: string;       // uint256
    sireId: string;         // uint256
    generation: string;     // uint256
    genes: string;          // uint256
}
