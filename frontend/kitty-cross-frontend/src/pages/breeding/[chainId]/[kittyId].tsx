import { Button, Flex, Input, Text, Image } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import Navbar from "../../../components/NavBar/Navbar";
import KittyCard from "../../../components/Profile/KittyCard";
import { getKitty } from "../../../utils/getKitty";
import { GetKittyDetails } from "../../../utils/types";
import { useApproveSiring } from "../../../utils/useApproveSiring";
import { getChainIdForNetworkName } from "../../../utils/constants";
export default function Page() {
  const router = useRouter();
  const { kittyId, chainId } = router.query;
  const [kittyData, setKittyData] = useState<GetKittyDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedChainId, setSelectedChainId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    if (chainId && kittyId) {
      getKitty(chainId, kittyId, setIsLoading, setKittyData, setError);
    }
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
    const res = useApproveSiring(
      chainId,
      kittyId,
      selectedChainId,
      selectedAddress
    );
  };

  const isButtonSelected = (chainId) => selectedChainId === chainId;


  return (
    <>
      <Navbar />
      <Layout>
        {kittyData && (
          <Flex justifyContent="center" alignItems="center" gap={16}>
            <KittyCard kittyId={kittyId.toString()} kitty={kittyData} />
            <Flex direction={"column"} gap={4}>
              <Text fontSize="2xl" fontWeight="bold">
                Select Chain For Siring:
              </Text>
              <Flex direction="column" align="center">
                <Flex mb={4} gap={4}>
                  <Button onClick={() => handleChainSelect(getChainIdForNetworkName("scroll-sepolia"))} opacity={isButtonSelected(getChainIdForNetworkName("scroll-sepolia")) ? 1 : 0.4}>
                    <Image
                      src="/scroll.jpeg"
                      alt="Scroll"
                      boxSize="30px"
                      borderRadius={"50%"}
                    />
                  </Button>
                  <Button onClick={() => handleChainSelect("2")}>
                    <Image
                      src="/arbitrum.webp"
                      alt="Arbitrum"
                      boxSize="30px"
                      borderRadius={"50%"}
                    />
                  </Button>
                  <Button onClick={() => handleChainSelect("3")}>
                    <Image
                      src="/polygon.png"
                      alt="Polygon"
                      boxSize="30px"
                      borderRadius={"50%"}
                    />
                  </Button>
                  <Button onClick={() => handleChainSelect("4")}>
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
                  placeholder="0x address"
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
            </Flex>
          </Flex>
        )}
      </Layout>
    </>
  );
}
