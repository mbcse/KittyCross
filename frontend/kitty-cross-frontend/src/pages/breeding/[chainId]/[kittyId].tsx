import {
  Button,
  Flex,
  Input,
  Text,
  Image,
  useDisclosure,
  Box,
  CloseButton,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import Navbar from "../../../components/NavBar/Navbar";
import KittyCard from "../../../components/Profile/KittyCard";
import { getKitty } from "../../../utils/getKitty";
import { GetKittyDetails } from "../../../utils/types";
import { useApproveSiring } from "../../../utils/useApproveSiring";
import { getChainIdForNetworkName } from "../../../utils/constants";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import {
  contractABI,
  contractAddresses,
  getNetworkNameForChainId,
} from "../../../utils/constants";
import React from "react";

export default function Page() {
  const router = useRouter();
  const { kittyId, chainId } = router.query;
  const [kittyData, setKittyData] = useState<GetKittyDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedChainId, setSelectedChainId] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    if (chainId && kittyId) {
      getKitty(chainId, kittyId, setIsLoading, setKittyData, setError);
    }

    //event listner for KittyBorn Event
    //pop up with info when event found

  //   const KittyBornListener = async () => {
  //     const ethereum = (window as any).ethereum;
  //     const accounts = await ethereum.request({
  //       method: "eth_requestAccounts",
  //     });

  //     const provider = new ethers.providers.Web3Provider(ethereum);
  //     const walletAddress = accounts[0]; // first account in MetaMask
  //     const signer = provider.getSigner(walletAddress);
  //     // TODO: get the chain ID that we called the breed function on
  //     const contractAddress =
  //       contractAddresses[getNetworkNameForChainId(84531)];

  //     const contract = new ethers.Contract(
  //       contractAddress,
  //       contractABI,
  //       provider
  //     );

  //     const eventName = "KittyBorn";

  //     const handleEvent = (event: any) => {
  //       alert("Kitty Born" + event);
  //       console.log(`Event '${eventName}' received:`, event);
  //     };

  //     contract.on(eventName, handleEvent);
  //     // Cleanup the event listener when the component unmounts
  //     // return () => {
  //     //   contract.off(eventName, handleEvent);
  //     // };
  //   };

  //   KittyBornListener();
  }, [chainId, kittyId]);

  const handleAddressChange = (event) => {
    setSelectedAddress(event.target.value);
  };

  const handleChainIdChange = (event) => {
    setSelectedChainId(event.target.value);
  };

  const handleChainSelect = (chainId) => {
    setSelectedChainId(chainId);
  };

  const onClickSiringApproval = async () => {
    const tx = useApproveSiring(
      chainId,
      kittyId,
      selectedChainId,
      selectedAddress,
      setTxHash
    );
  };

  const isButtonSelected = (chainId) => selectedChainId === chainId;

  return (
    <>
      <Navbar />
      <Layout>
        {kittyData && (
          <Flex justifyContent="center" alignItems="center" gap={16}>
            <KittyCard
              clickable={true}
              chainId={chainId}
              kittyId={kittyId.toString()}
              kitty={kittyData}
            />
            <Flex direction={"column"} gap={4}>
              <Text fontSize="2xl" fontWeight="bold">
                Select Chain For Siring:
              </Text>
              <Flex direction="column" align="center">
                <Flex mb={4} gap={4}>
                  <Button
                    onClick={() =>
                      handleChainSelect(
                        getChainIdForNetworkName("scroll-sepolia")
                      )
                    }
                    opacity={
                      isButtonSelected(
                        getChainIdForNetworkName("scroll-sepolia")
                      )
                        ? 1
                        : 0.4
                    }
                  >
                    <Image
                      src="/scroll.jpeg"
                      alt="Scroll"
                      boxSize="30px"
                      borderRadius={"50%"}
                    />
                  </Button>
                  <Button
                    onClick={() =>
                      handleChainSelect(
                        getChainIdForNetworkName("arbitrum-goerli")
                      )
                    }
                    opacity={
                      isButtonSelected(
                        getChainIdForNetworkName("arbitrum-goerli")
                      )
                        ? 1
                        : 0.4
                    }
                  >
                    <Image
                      src="/arbitrum.webp"
                      alt="Arbitrum"
                      boxSize="30px"
                      borderRadius={"50%"}
                    />
                  </Button>
                  <Button
                    onClick={() =>
                      handleChainSelect(
                        getChainIdForNetworkName("polygon-zkevm-testnet")
                      )
                    }
                    opacity={
                      isButtonSelected(
                        getChainIdForNetworkName("polygon-zkevm-testnet")
                      )
                        ? 1
                        : 0.4
                    }
                  >
                    <Image
                      src="/polygon.png"
                      alt="Polygon"
                      boxSize="30px"
                      borderRadius={"50%"}
                    />
                  </Button>
                  <Button
                    onClick={() =>
                      handleChainSelect(getChainIdForNetworkName("base-goerli"))
                    }
                    opacity={
                      isButtonSelected(getChainIdForNetworkName("base-goerli"))
                        ? 1
                        : 0.4
                    }
                  >
                    <Image
                      src="/base.png"
                      alt="Base"
                      boxSize="30px"
                      borderRadius={"50%"}
                    />
                  </Button>
                </Flex>
                <Input
                  placeholder="chainId"
                  size="md"
                  value={selectedChainId}
                  readOnly
                />

                <Text fontSize="2xl" fontWeight="bold">
                  Approve Siring For Address:
                </Text>
                <Input
                  placeholder="0x06012c8cf97BEaD5deAe237070F9587f8E7A266d"
                  size="md"
                  value={selectedAddress} // Set the input value from state
                  onChange={handleAddressChange}
                />
              </Flex>

              <Button
                isDisabled={!selectedChainId || !selectedAddress}
                onClick={onClickSiringApproval}
              >
                Approve Siring
              </Button>
              {txHash && (
                <>
                  <Text fontSize="xs">Transaction Hash:</Text>
                  <Text fontSize={"xs"}>{txHash}</Text>
                </>
              )}
            </Flex>
          </Flex>
        )}
      </Layout>
    </>
  );
}
