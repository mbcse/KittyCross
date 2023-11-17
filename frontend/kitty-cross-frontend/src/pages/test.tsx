import { useAccount } from "wagmi";
import Navbar from "../components/NavBar/Navbar";

export default function Test() {
  const { address, isConnecting, isDisconnected } = useAccount();

  console.log("address: ", address);

  return <Navbar />;
}
