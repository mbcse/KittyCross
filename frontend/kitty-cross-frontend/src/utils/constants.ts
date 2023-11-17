import { Address } from "wagmi";

interface ContractAddresses {
    polygonZkEVM: Address,
    scroll: Address,
    arbitrum: Address,
    base: Address
}
export interface KittesPerChain {
    polygonZkEVM: number[],
    scroll: number[],
    arbitrum: number[],
    base: number[]
}

export const contractAddresses : ContractAddresses = {
    // just placeholders for now
    polygonZkEVM : '0x4458Bd6E2A8aBd2Ee3EeEaA5E1AeAeA0098f9Cf7',
    scroll : '0x4458Bd6E2A8aBd2Ee3EeEaA5E1AeAeA0098f9Cf7',
    arbitrum : '0x4458Bd6E2A8aBd2Ee3EeEaA5E1AeAeA0098f9Cf7',
    base : '0x4458Bd6E2A8aBd2Ee3EeEaA5E1AeAeA0098f9Cf7',
}

export const contractABI = [/* ...ERC-721 ABI... */];
