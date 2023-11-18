import { Grid, GridItem } from "@chakra-ui/react";
import ProfileColumn from "./ProfileColumn";
export default function ProfileGrid({kittyData}: any) {
  return (
    <>
      <Grid templateColumns="repeat(4, 1fr)" gap={8}>
        <ProfileColumn
          chainName="Scroll"
          networkName="base"
          imageSource="scroll.jpeg"
          kitties={kittyData["scroll"]}
        />
        <ProfileColumn
          chainName="Polygon zkEVM"
          networkName="base"
          imageSource="polygon.png"
          kitties={kittyData["polygon-zkevm"]}
        />
        <ProfileColumn
          chainName="Base"
          networkName="base"
          imageSource="base.png"
          kitties={kittyData["base"]}
        />
        <ProfileColumn
          chainName="Arbitrum"
          networkName="arbitrum"
          imageSource="arbitrum.webp"
          kitties={kittyData["arbitrum"]}
        />
      </Grid>
    </>
  );
}
