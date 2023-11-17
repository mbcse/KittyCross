import { contractABI, contractAddresses } from "./constants";
import { useContractRead } from 'wagmi';



async function getAllTokensOfOwner(ownerAddress) {
    const { data, isError, isLoading } = useContractRead({
        address: contractAddresses,
        abi: contractABI,
        functionName: 'totalSupply',
      })

    const totalSupply = await contract.methods.totalSupply().call();
    const tokens = [];
  
    for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
      try {
        const tokenOwner = await contract.methods.ownerOf(tokenId).call();
        if (tokenOwner.toLowerCase() === ownerAddress.toLowerCase()) {
          tokens.push(tokenId);
        }
      } catch (error) {
        // Handle errors (e.g., token does not exist)
      }
    }
  
    return tokens;
  }
  
  getAllTokensOfOwner('0xOwnerAddress').then(console.log);
  