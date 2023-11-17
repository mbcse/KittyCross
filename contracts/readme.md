

### Changes to CryptoKitties

- updated all contracts to 0.8.20 (made a lot of changes accordingly)
- moved `_transfer()`, `_createKitty()` from `KittyBase` to `KittyERC721`


### Contract Descriptions

#### KittyAccessControl

role-based access control

#### KittyBase

- Kitty struct and array (the token array)

#### KittyERC721

- inherits from ERC721 and KittyBase
- oved `_transfer()`, `_createKitty()` from `KittyBase`
- `approve()`, `transfer()`, `transferFrom()`

#### KittyBreeding

- breeding functionality and checks
- `giveBirth()`, `isReadyToBreed()`, `isPregnant()`, `canBreedWith()`, 


#### KittyAuction


#### KittyMinting


## Notes

- removed `bid()` from `ClockAuction` (also exists in `SiringClockAuction` ?)