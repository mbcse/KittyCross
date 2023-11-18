import { Grid, GridItem } from "@chakra-ui/react";
import ProfileColumn from "./ProfileColumn";
export default function ProfileGrid({kittyData}: any) {
  console.log(kittyData)
  return (
    <>
      <Grid templateColumns="repeat(4, 1fr)" gap={8}>
        <ProfileColumn
          chainName="Scroll"
          imageSource="scroll.jpeg"
          kitties={kittyData["scroll"]}
        />
        <ProfileColumn
          chainName="Polygon zkEVM"
          imageSource="polygon.png"
          kitties={kittyData["polygon-zkevm"]}
        />
        <ProfileColumn
          chainName="Base"
          imageSource="base.png"
          kitties={kittyData["base"]}
        />
        <ProfileColumn
          chainName="Arbitrum"
          imageSource="arbitrum.webp"
          kitties={kittyData["arbitrum"]}
        />
      </Grid>
    </>
  );
}
