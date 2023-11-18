import { useRouter } from "next/router";
import ProfileGrid from "../components/ProfileGrid";
import { Text } from "@chakra-ui/react";
import Navbar from "../components/NavBar/Navbar";
import Layout from "../components/Layout";
export default function MyKitties() {
  return (
    <>
      <Navbar />
      <Layout>
        <Text fontSize="2xl">My Cats:</Text>
        <ProfileGrid />
      </Layout>
    </>
  );
}
