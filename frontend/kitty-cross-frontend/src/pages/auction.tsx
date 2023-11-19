import { Flex, Text } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import Layout from "../components/Layout";
import Navbar from "../components/NavBar/Navbar";
import ProfileGrid from "../components/ProfileGrid";
import { useEffect, useState } from "react";
import { getSingleKitty } from "../utils/getKitty";
import KittyCard from "../components/Profile/KittyCard";
import { useBreedWithAutoCrossChain } from "../utils/useBreedWithAutoCrossChain";
export default function MyKitties() {
  const { address, isConnected } = useAccount();
  const [kittyData, setKittyData] = useState(null);
  const [matingKittiesData, setMatingKittiesData] = useState(null);
  const [openMatrons, setOpenMatrons] = useState(false);
  const [sireChainId, setSireChainId] = useState(null);
  const [sireKittyId, setSireKittyId] = useState(null);

  const [txHash, setTxHash] = useState(null);

  const [matronChainId, setMatronChainId] = useState(null);
  const [matronKittyId, setMatronKittyId] = useState(null);

  const auctionableKitties = [
    { chainId: 534351, kittyId: 1 },
    { chainId: 534351, kittyId: 3 },
    { chainId: 421613, kittyId: 3 },
  ];
  const matingKitties = [{ chainId: 1442, kittyId: 2 }];
  // , { chainId: 1, kittyId: 120001 }, { chainId: 1, kittyId: 1 }, {chainId:1, kittyId: 20000}];

  const toggleOpenMatrons = () => {
    setOpenMatrons(true);
  };

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
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await Promise.all(
        matingKitties.map(async (kitty) => {
          const kittyData = await getSingleKitty(kitty.chainId, kitty.kittyId);
          return kittyData;
        })
      );
      setMatingKittiesData(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log(kittyData);
  }, []);

  return (
    <>
      <Navbar />
      <Layout>
        <Text fontSize="2xl">Cats on Auction:</Text>
        <Flex
          direction="row"
          justifyContent="center"
          alignItems="center"
          gap={8}
        >
          {kittyData &&
            kittyData.map((kitty, i) => {
              return (
                <KittyCard
                  clickable={false}
                  key={i}
                  showButtons={true}
                  chainId={auctionableKitties[i].chainId}
                  kittyId={auctionableKitties[i].kittyId.toString()}
                  kitty={kitty}
                  toggle={() => {
                    toggleOpenMatrons();
                  }}
                  handleSelect={() => {
                    setMatronKittyId(auctionableKitties[i].kittyId);
                    setMatronChainId(auctionableKitties[i].chainId);
                  }}
                />
              );
            })}
        </Flex>

        {openMatrons && (
          <>
            <Text fontSize="2xl">Breed With Following Sires:</Text>
            <Flex
              direction="row"
              justifyContent="center"
              alignItems="center"
              gap={8}
            >
              {matingKittiesData &&
                matingKittiesData.map((kitty, i) => {
                  return (
                    <KittyCard
                      clickable={false}
                      finalStage={true}
                      key={i}
                      showButtons={false}
                      chainId={matingKitties[i].chainId}
                      kittyId={matingKitties[i].kittyId.toString()}
                      handleSelect={async () => {
                        console.log("handleSelect");
                        const data = await useBreedWithAutoCrossChain(
                          matronChainId,
                          matingKitties[i].chainId,
                          matronKittyId,
                          matingKitties[i].kittyId,
                          setTxHash
                        );
                      }}
                      kitty={kitty}
                      toggle={() => {
                        toggleOpenMatrons();
                      }}
                    />
                  );
                })}
            </Flex>

            {txHash && (
              <>
                <Text fontSize="2l">Transaction Hash:</Text>
                <Text fontSize="2l">{txHash}</Text>
              </>
            )}
          </>
        )}
      </Layout>
    </>
  );
}
