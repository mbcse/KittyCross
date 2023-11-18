import { useRouter } from "next/router";
import KittyCard from "../../../components/Profile/KittyCard";
import Navbar from "../../../components/NavBar/Navbar";
import Layout from "../../../components/Layout";
import { useEffect, useState } from "react";
import { GetKittyDetails } from "../../../utils/types";
import { getKitty } from "../../../utils/getKitty";
import KittyDetailed from "../../../components/Profile/KittyDetailed";
export default function Page() {
  const router = useRouter();
  const { kittyId, chainId } = router.query;
  const [kittyData, setKittyData] = useState<GetKittyDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (chainId && kittyId) {
      getKitty(chainId, kittyId, setIsLoading, setKittyData, setError);
    }
  }, [chainId, kittyId]);

  return (
    <>
      <Navbar />
      <Layout>
        <div>ChainId: {chainId}</div>
        <div>KittyId: {kittyId}</div>
        {kittyData ? (
          <KittyDetailed kitty={kittyData} kittyId={String(kittyId)} />
        ) : null}
      </Layout>
    </>
  );
}
