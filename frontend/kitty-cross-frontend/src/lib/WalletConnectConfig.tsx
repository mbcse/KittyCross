"use client";
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { WagmiConfig } from 'wagmi'
import { arbitrum, mainnet, polygonZkEvm, polygonZkEvmTestnet, optimism, optimismGoerli, scroll, scrollSepolia, base, baseGoerli, mantle } from 'viem/chains'

const projectId = 'e4eeddc7fa3f6ce9006ddb5ae06ef3d4'

const metadata = {
  name: 'KittyCross',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, arbitrum, polygonZkEvm, polygonZkEvmTestnet, optimism, optimismGoerli, scroll, scrollSepolia, base, baseGoerli, mantle]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

createWeb3Modal({ wagmiConfig, projectId, chains })

export function Web3Modal({ children }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}