import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const { kittyId, chainId } = router.query;

  return (
    <>
      <div>My Post: {kittyId}</div>
      <div>My Post: {chainId}</div>
    </>
  );
}
