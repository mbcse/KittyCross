import { useRouter } from "next/router";
import ProfileGrid from "../components/ProfileGrid";
import { Text } from "@chakra-ui/react";
import Navbar from "../components/NavBar/Navbar";
import Layout from "../components/Layout";
import { useAllTokensOfOwner } from "../utils/useAllTokensOfOwner";
import { useAccount } from "wagmi";
import { useEffect } from "react";
export default function MyKitties() {
  const { address, isConnected } = useAccount();

  const userTokens = useAllTokensOfOwner(address);
  useEffect(() => {
    // console.log('userTokens')
    // console.log(userTokens);
  }, [userTokens]);
  return (
    <>
      <Navbar />
      <Layout>
        <Text fontSize="2xl">My Cats:</Text>
        <ProfileGrid kittyData={userTokens} />
      </Layout>
    </>
  );
}
