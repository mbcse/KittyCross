import { useRouter } from "next/router";
import KittyCard from "../../../components/Profile/KittyCard";

export default function Page() {
  const router = useRouter();
  const { kittyId } = router.query;

  return <KittyCard kittyId={String(kittyId)}/>
}
