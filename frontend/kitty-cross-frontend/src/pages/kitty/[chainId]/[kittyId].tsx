import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const { kittyId, chainId } = router.query;

  return (
    <>
      <div>ChainId: {chainId}</div>
      <div>KittyId: {kittyId}</div>
    </>
  );
}
