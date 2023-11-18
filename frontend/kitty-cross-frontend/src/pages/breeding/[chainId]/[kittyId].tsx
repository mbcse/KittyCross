import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import Navbar from "../../../components/NavBar/Navbar";
import KittyCard from "../../../components/Profile/KittyCard";
import { getKitty } from "../../../utils/getKitty";
import { GetKittyDetails } from "../../../utils/types";
import { useApproveSiring } from "../../../utils/useApproveSiring";
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

  const onClickSiringApproval = async () => {
    const res = useApproveSiring(
      chainId,
      kittyId,
      selectedChainId,
      selectedAddress
    );
  };

  return (
    <>
      <Navbar />
      <Layout>
        {kittyData && (
          <Flex justifyContent="center" alignItems="center" gap={16}>
            <KittyCard kittyId={kittyId.toString()} kitty={kittyData} />
            <Flex direction={"column"} gap={4}>
              <Text fontSize="2xl" fontWeight="bold">
                Approve Siring For Address:
              </Text>
              <Input
                placeholder="0x address"
                size="md"
                value={selectedAddress} // Set the input value from state
                onChange={handleAddressChange}
              />

              <Text fontSize="2xl" fontWeight="bold">
                On ChainId:
              </Text>
              <Input
                placeholder="chainId"
                size="md"
                value={selectedChainId} // Set the input value from state
                onChange={handleChainIdChange}
              />

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
