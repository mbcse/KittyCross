import { Button } from '@chakra-ui/react'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { BsPlus } from 'react-icons/bs'
import { FaNetworkWired } from "react-icons/fa6";
import { LuWallet } from "react-icons/lu";


export default function ConnectButton() {
  // 4. Use modal hook
  const { open } = useWeb3Modal()

  return (
    <>
    <Button colorScheme="pink" leftIcon={<LuWallet />}  onClick={() => open()}/>
    <Button colorScheme="pink" leftIcon={<FaNetworkWired />}  onClick={() => open({ view: 'Networks' })}/>
    </>
  )
}