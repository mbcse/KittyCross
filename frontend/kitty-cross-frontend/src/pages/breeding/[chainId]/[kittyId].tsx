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
        <div>Your Kitties ChainId: {chainId}</div>
        <div>Your Kitties KittyId: {kittyId}</div>

        <div>List of Kitties to pair with</div>


      </Layout>
    </>
  );
}
