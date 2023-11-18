import { Address } from "wagmi";
import { arbitrum, mainnet, polygonZkEvm, polygonZkEvmTestnet, optimism, optimismGoerli, scroll, scrollSepolia, base, baseGoerli, mantle } from 'viem/chains'


export const supportedChains = [mainnet, arbitrum, polygonZkEvm, polygonZkEvmTestnet, optimism, optimismGoerli, scroll, scrollSepolia, base, baseGoerli, mantle];
interface ContractAddresses {
    "polygon-zkevm": Address,
    "scroll": Address,
    "arbitrum": Address,
    "base": Address
}
export interface KittesPerChain {
    "polygon-zkevm": number[],
    "scroll": number[],
    "arbitrum": number[],
    "base": number[]
}

export const contractAddresses : ContractAddresses = {
    // just placeholders for now
    "polygon-zkevm": '0x4458Bd6E2A8aBd2Ee3EeEaA5E1AeAeA0098f9Cf7',
    "scroll" : '0x4458Bd6E2A8aBd2Ee3EeEaA5E1AeAeA0098f9Cf7',
    "arbitrum" : '0x4458Bd6E2A8aBd2Ee3EeEaA5E1AeAeA0098f9Cf7',
    "base" : '0x4458Bd6E2A8aBd2Ee3EeEaA5E1AeAeA0098f9Cf7',
}

export const contractABI = [/* ...ERC-721 ABI... */];

export const getNetworkNameForChainId = (chainId) => {
    const chain = supportedChains.find((c) => c.id === chainId);
    return chain ? chain.network : undefined;
};

export const getChainIdForNetworkName = (networkName) => {
    const chain = supportedChains.find((c) => c.network === networkName);
    return chain ? chain.id : undefined;
}
