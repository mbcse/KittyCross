import { useContractRead } from "wagmi";
import { contractABI } from "../utils/constants";
import { readContract } from "@wagmi/core";


export default function testHooks() {
    const { data, isError, isLoading } = useContractRead({
        address: "0x06012c8cf97BEaD5deAe237070F9587f8E7A266d",
        abi: contractABI,
        functionName: "tokensOfOwner",
        args: ["0x61a4575D63C63F9F05447395760dba3Ed602c48c"],
        chainId: 1,
      });

      console.log(data);
  return (
    <>
      <p>hi</p>
    </>
  );
}
