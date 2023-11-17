import { useRouter } from "next/router";
import KittyCard from "../../../components/Profile/KittyCard";
export default function Page() {
  const router = useRouter();
  const { kittyId, chainId } = router.query;

  return (
    <>
      <div>ChainId: {chainId}</div>
      <div>KittyId: {kittyId}</div>
     <KittyCard kittyId={String(kittyId)}/>
     

    </>
  );
}
