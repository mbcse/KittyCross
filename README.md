# KittyCross
## Collecting and Breeding Kitties Cross-Chain
An ETH Istanbul 2023 Project.

### Short Description
In KittyCross, breed and collect ERC721 kitties with unique genetics across rollups. Their looks and home chains are determined by their DNA. Using DALL-E, each kitty's appearance is a visual treat, directly reflecting its genes. Embrace the extra meow with KittyCross! 🐱🌐🎮

### Description
Welcome to KittyCross, the fur-tastic cross-chain adventure! This project is all about collecting and breeding digital kitties across different rollups. Each kitty has their own genetic makeup that determines their look – from the swish of their tail to the twinkle in their eyes, and one special trait: their home chainID that determines which rollup chain our furry friend lives on.

Here’s where it gets purr-fect: when you breed two kitties, their offspring will carry a mix of their genes, with some unpredictable mutation. What's super cool is that the chainID trait in their DNA tends to land them on a different rollup chain than their parents. We support @Scroll, @Base, @Arbitrum, and @PolygonZKEVM.  So, be prepared to hop across various rollups to cuddle your new fur-babies!

We have forked the original CryptoKitties smart contracts, re-wrote them to be cross-chain compatible and adjusted the genetic code: We've woven the chainID right into their genetic fabric, ensuring a meow-tastic cross-chain experience. 

And for the cherry on top, your newborn kitties will be generated using DALL-E based on the genetic makeup! DALL-E is deterministic when providing the same seed, so we invented a prompt structure based on the genetic properties that will always result in the same kit-tastic image. Plus, we’ve built a sleek front-end from scratch. 🐾🌐🎮

### How It's Made
KittyCross is a meow-tastic ERC721 game, creating a unique kitty collecting and breeding experience. The front-end is built using React and NextJS, with WalletConnect for user authentication and smart contract interactions.

We forked and upgraded the CryptoKitties smart contracts to the latest Solidity version. Notably, we adjusted the kitty genetics to include chainID as a trait stack, enabling cross-chain breeding. This includes one visible chainID and three hidden ones, increasing the likelihood of different chainIDs surfacing during breeding.

Our KittyCross contract introduces additional variables and mappings for cross-chain breeding. We support rollup chains like @Base, @Scroll, @Arbitrum, and @PolygonZKEVM, facilitated by @Hyperlane for cross-chain interactions.

The breeding process is now multi-step, accommodating sires and matrons on different chains. It involves no-cooldown checks, “anti-incest” checks, and updates in breeding states. Upon successful breeding request, the genetics of the sire are sent to the matron for calculating the genetic combination.

Post-pregnancy, the genes of the sire and matron are mixed to determine the newborn kitty's traits, including the chain ID. This ID dictates the chain where the kitty is minted. Again, @Hyperlane is used to mint the new kitty on the destination chain.

We departed from the pre-defined imagery model of CryptoKitties. Instead, we use DALL-E to generate kitty images based on their genetics. The results are deterministic, with a fixed seed ensuring consistency. These images are cached and stored on IPFS via @Filecoin for quicker access.

The back-end, developed in Python, orchestrates these components. To add unpredictability in kitty traits, we integrated @Chainlink VRF. This prevents users from predicting or engineering specific rare traits, adding a layer of randomness and fairness to the breeding process.

### Deployed Contracts

#### Arbitrum
KittyCore: https://goerli.arbiscan.io/address/0xee76132BB4fd271870be87d898A9755f6BB10260
CrossGeneScience: https://goerli.arbiscan.io/address/0x80D259cB8552aDd69c699eF139579fFf64115697

#### Scroll
KittyCore: https://sepolia.scrollscan.dev/address/0x7C12cd69Ab858313C4f2E1547eC3fA861E0bd808
CrossGeneScience: https://sepolia.scrollscan.dev/address/0xbc5a35b8b885137abbca42cc960321645a0b76d8

#### Base
KittyCore: https://goerli.basescan.org/address/0xaed048c393f319407b3cf2c9ec9f7987318ef63a
CrossGeneScience: https://goerli.basescan.org/address/0x6211F610C39B4F1F641db47235Feda5524bf7C7f

#### PolygonZKEVM
KittyCore: https://testnet-zkevm.polygonscan.com/address/0xFFc6054e6C8929E3d8356e5f09164E51302A41a9
CrossGeneScience: https://testnet-zkevm.polygonscan.com/address/0x1dD38615645e6512684f39B6f851C8D69f305eb9

#### Linea
KittyCore: https://explorer.goerli.linea.build/address/0x0344DBaf786945198Ad6ABF0b5E73060751D0eB3
CrossGeneScience: https://explorer.goerli.linea.build/address/0xbc00fe101346856ca7Ea27b6A13D07dB9B67532b

#### Mantle
KittyCore: https://explorer.testnet.mantle.xyz/address/0xB4F9dDedEcd61eC2237CeB6981de139481fF6a28
CrossGeneScience: https://explorer.testnet.mantle.xyz/address/0x06b30d285A58243790Ab7209b4544C5d52D51725

### Changes to CryptoKitties

- updated all contracts to 0.8.20 (made a lot of changes accordingly)
- moved `_transfer()`, `_createKitty()` from `KittyBase` to `KittyERC721`
- added `KittyCross` containing some variables for cross-chain interactions
- completely updated `KittyBreeding` for cross-chain breeding
  - added Hyperlane for cross-chain interaction
  - multi-step breeding process to query sire on different chain and separate the checks performed; callback with revert or success to matron
  - newborn kitty can be born on different chain
- adjusted kitty genetics to additionally encode the chainID with a visible and hidden chainIDs
- added DALL-E to deterministically generate pictures based on genetic properties for newborn kitties
- added Chainlink VRF for random genetic combination. Before, users could predict resulting traits based on blocknumber


## Notes

- removed `bid()` from `ClockAuction` (also exists in `SiringClockAuction` ?)
- `KittyCore.sol`: `_createKitty(..)` with 0 instead of -1
- changed L163 of GenScience to encode parameters for keccak
- decide where chainIDs goes

### Kitty Cross Image Generator Server

=== GET /taxi 

"Scam"

=== GET /kitties 
retrieves all IPFS urls for a requested set of kitties, creating the missing ones

request (json)

[
    {
        "id" : 1000,
        "chain" : 0,
        "genes" : [31,19,8,10,9,24,23,17]
    },
    {
        "id" : 1001,
        "chain" : 1,
        "genes" : [31,19,8,10,9,24,23,0]
    }
]

response (json)

{
    "1000": "https://gateway.pinata.cloud/ipfs/QmcexV89gWivPh5NaRzdnLJdLPK3tVXpd8aKsjdsCbFM7E",
    "1001": "https://gateway.pinata.cloud/ipfs/QmQCDauymDNbGWUWp6qh5pScRziTjxcX6Epukm6eZYYErP"
}


=== GET /storage
retrieves all entries currently known and the url in IPFS

response (json)

{
    "1000": "https://gateway.pinata.cloud/ipfs/QmcexV89gWivPh5NaRzdnLJdLPK3tVXpd8aKsjdsCbFM7E",
    "1001": "https://gateway.pinata.cloud/ipfs/QmQCDauymDNbGWUWp6qh5pScRziTjxcX6Epukm6eZYYErP"
}
