import { Grid, GridItem } from "@chakra-ui/react";
import ProfileColumn from "./ProfileColumn";
export default function ProfileGrid() {
  return (
    <>
      <Grid templateColumns="repeat(4, 1fr)" gap={8}>
        <ProfileColumn chainName="Scroll" imageSource="scroll.jpeg"/>
        <ProfileColumn chainName="Polygon zkEVM" imageSource="polygon.png"/>
        <ProfileColumn chainName="Base" imageSource="base.png"/>
        <ProfileColumn chainName="Arbitrum" imageSource="arbitrum.webp"/>
      </Grid>
    </>
  );
}
