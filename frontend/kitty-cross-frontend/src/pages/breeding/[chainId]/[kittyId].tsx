import { useRouter } from "next/router";
import Navbar from "../../../components/NavBar/Navbar";
import Layout from "../../../components/Layout";
import { useGetKitty } from "../../../utils/useGetKitty";
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

    const loadKitty = async () => {
      try {
        setIsLoading(true);
        const rpcUrl = supportedChains[0].rpcUrls.default.http[0];
        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const contractAddress =
          contractAddresses[getNetworkNameForChainId(chainId)];
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          provider
        );
        const kittyData = await contract.getKitty(kittyId);
        setKittyData(kittyData);
      } catch (err) {
        console.error("Error fetching kitty data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (chainId && kittyId) {
      loadKitty();
    }
  }, [chainId, kittyId ]);

  useEffect(() => {
    console.log(kittyData);
    // console.log(kittyData?.genes);
  }, [kittyData]);

  // const { isGestating, isReady, cooldownIndex, nextActionAt, siringWithId, birthTime, matronId, sireId, generation, genes} = kittyData;


  return (
    <>
      <Navbar />
      <Layout>
        <p>
        {kittyData ? kittyData.toString(): null}
        </p>
        <p>
          Matron: {kittyData.matronId.toString()}
        </p>
        <p>
          Sire: {kittyData.sireId.toString()}
        </p>
        {/* <p>
          If it is male kitty: show option to approve male kitty for a chain and
          a female
        </p>
        <p>
          If it is a female kitty on a chain that has a male approval, allow to
          call breed (fail or success)
        </p>

        <p>Select Cat To Breed with</p>
        <div>Your Kitties ChainId: {chainId}</div>
        <div>Your Kitties KittyId: {kittyId}</div>

        <div>List of Kitties to pair with</div> */}
      </Layout>
    </>
  );
}
