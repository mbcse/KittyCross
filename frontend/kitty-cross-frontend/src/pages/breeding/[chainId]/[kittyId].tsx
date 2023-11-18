import { useRouter } from "next/router";
import Navbar from "../../../components/NavBar/Navbar";
import Layout from "../../../components/Layout";
export default function Page() {
  const router = useRouter();
  const { kittyId, chainId } = router.query;

  return (
    <>
      <Navbar />
      <Layout>
        <p>Select Cat To Breed with</p>
        <div>ChainId: {chainId}</div>
        <div>KittyId: {kittyId}</div>
      </Layout>
    </>
  );
}
