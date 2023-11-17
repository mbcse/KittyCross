import { useRouter } from 'next/router';

export default function Page() {
  const router = useRouter();
  const { kittyId } = router.query;

  return <div>My Post: {kittyId}</div>;
}
