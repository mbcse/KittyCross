import { useRouter } from "next/router";
import Navbar from "../../../components/NavBar/Navbar";
import Layout from "../../../components/Layout";
import { getKitty } from "../../../utils/getKitty";
import { useEffect, useState } from "react";
import {
  contractABI,
  contractAddresses,
  getNetworkNameForChainId,
  supportedChains,
} from "../../../utils/constants";
import { ethers } from "ethers";
import { Text } from "@chakra-ui/react";
import { GetKittyDetails } from "../../../utils/types";
export default function Page() {
  const router = useRouter();
  const { kittyId, chainId } = router.query;
  const [kittyData, setKittyData] = useState<GetKittyDetails|null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (chainId && kittyId) {
      getKitty(chainId,kittyId, setIsLoading,setKittyData, setError);
    }
  }, [chainId, kittyId ]);

  return (
    <>
      <Navbar />
      <Layout>
        {kittyData ? kittyData.toString(): null}
      </Layout>
    </>
  );
}
