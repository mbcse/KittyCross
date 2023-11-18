import { useRouter } from "next/router";
import KittyCard from "../../../components/Profile/KittyCard";
import Navbar from "../../../components/NavBar/Navbar";
import Layout from "../../../components/Layout";
export default function Page() {
  const router = useRouter();
  const { kittyId, chainId } = router.query;

  return (
    <>
      <Navbar />
      <Layout>
        <div>ChainId: {chainId}</div>
        <div>KittyId: {kittyId}</div>
        <KittyCard kittyId={String(kittyId)} />
      </Layout>
    </>
  );
}
