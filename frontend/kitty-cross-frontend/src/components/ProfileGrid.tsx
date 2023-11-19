import { Grid, GridItem } from "@chakra-ui/react";
import ProfileColumn from "./ProfileColumn";
import { useEffect } from "react";
export default function ProfileGrid({ kittyData }: any) {
  useEffect(() => {
    // console.log("1");
    // console.log(kittyData);
    // console.log("2");
  }, [kittyData]);
  return (
    <>
      <Grid templateColumns="repeat(4, 1fr)" gap={8}>
        <ProfileColumn
          chainName="Scroll"
          networkName="scroll-sepolia"
          imageSource="scroll.jpeg"
          kitties={kittyData["scroll-sepolia"]}
        />
        <ProfileColumn
          chainName="Polygon zkEVM"
          networkName="polygon-zkevm-testnet"
          imageSource="polygon.png"
          kitties={kittyData["polygon-zkevm-testnet"]}
        />
        <ProfileColumn
          chainName="Base"
          networkName="base-goerli"
          imageSource="base.png"
          kitties={kittyData["base-goerli"]}
        />
        <ProfileColumn
          chainName="Arbitrum"
          networkName="arbitrum-goerli"
          imageSource="arbitrum.webp"
          kitties={kittyData["arbitrum-goerli"]}
        />
      </Grid>
    </>
  );
}
