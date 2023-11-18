import { Flex, Text } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import Layout from "../components/Layout";
import Navbar from "../components/NavBar/Navbar";
import ProfileGrid from "../components/ProfileGrid";
import { useEffect, useState } from "react";
import { getSingleKitty } from "../utils/getKitty";
import KittyCard from "../components/Profile/KittyCard";
export default function MyKitties() {
  const { address, isConnected } = useAccount();
  const [kittyData, setKittyData] = useState(null);

  const auctionableKitties = [{ chainId: 84531, kittyId: 1 }];
    // , { chainId: 1, kittyId: 120001 }, { chainId: 1, kittyId: 1 }, {chainId:1, kittyId: 20000}];

  useEffect(() => {
    const fetchData = async () => {
      const data = await Promise.all(
        auctionableKitties.map(async (kitty) => {
          const kittyData = await getSingleKitty(kitty.chainId, kitty.kittyId);
          return kittyData;
        })
      );
      setKittyData(data);
    };

    fetchData();
  }, [auctionableKitties]);

  useEffect(() => {
    console.log(kittyData);
  },[])

  return (
    <>
      <Navbar />
      <Layout>
        <Text fontSize="2xl">Cats on Auction:</Text>
        <Flex direction="row" justifyContent="center" alignItems="center" gap={8}>
        {kittyData && kittyData.map((kitty,i) => {
            return <KittyCard key={i} showButtons={true} chainId={auctionableKitties[i].chainId} kittyId={auctionableKitties[i].kittyId.toString()} kitty={kitty} />
        })}
        </Flex>
      </Layout>
    </>
  );
}
