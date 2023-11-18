import { Grid, GridItem } from "@chakra-ui/react";
import ProfileColumn from "./ProfileColumn";
export default function ProfileGrid() {
  return (
    <>
      <Grid templateColumns="repeat(4, 1fr)" gap={8}>
        <ProfileColumn chainName="Scroll"/>
        <ProfileColumn chainName="Polygon zkEVM"/>
        <ProfileColumn chainName="Base"/>
        <ProfileColumn chainName="Arbitrum"/>
      </Grid>
    </>
  );
}
