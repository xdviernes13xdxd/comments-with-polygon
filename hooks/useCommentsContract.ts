import * as wagmi from "wagmi";
import { useProvider, useSigner } from "wagmi";
import type { BigNumber } from "ethers";
// Import our contract ABI (a json representation of our contract's public interface).
// The hardhat compiler writes this file to artifacts during compilation.


export interface Comment {
  id: string;
  topic: string;
  message: string;
  creator_address: string;
  created_at: BigNumber;
}

export enum EventType {
  CommentAdded = "CommentAdded",
}

const useCommentsContract = () => {
  // An ethers.Signer instance associated with the signed-in wallet.
  // https://docs.ethers.io/v5/api/signer/
  const [signer] = useSigner();
  // An ethers.Provider instance. This will be the same provider that is
  // passed as a prop to the WagmiProvider.
  const provider = useProvider();

  // This returns a new ethers. Contract ready to interact with our comments API.
  // We need to pass in the address of our deployed contract as well as its abi.
  // We also pass in the signer if there is a signed in wallet, or if there's
  // no signed in wallet then we'll pass in the connected provider.
  const contract = wagmi.useContract({
    addressOrName: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    contractInterface: [
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "uint32",
              "name": "id",
              "type": "uint32"
            },
            {
              "internalType": "string",
              "name": "topic",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "creator_address",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "message",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "created_at",
              "type": "uint256"
            }
          ],
          "indexed": false,
          "internalType": "struct Comments.Comment",
          "name": "comment",
          "type": "tuple"
        }
      ],
      "name": "CommentAdded",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "topic",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "message",
          "type": "string"
        }
      ],
      "name": "addComment",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "topic",
          "type": "string"
        }
      ],
      "name": "getComments",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint32",
              "name": "id",
              "type": "uint32"
            },
            {
              "internalType": "string",
              "name": "topic",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "creator_address",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "message",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "created_at",
              "type": "uint256"
            }
          ],
          "internalType": "struct Comments.Comment[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
    signerOrProvider: signer.data || provider,
  });

  // Wrapper to add types to our getComments function.
  const getComments = async (topic: string): Promise<Comment[]> => {
    return contract.getComments(topic).then((comments) => {
      // Each comment is represented as array by default so we convert to object
      return comments.map((c) => ({ ...c }));
    });
  };

  // Wrapper to add types to our addComment function.
  const addComment = async (topic: string, message: string): Promise<void> => {
    // Create a new transaction
    const tx = await contract.addComment(topic, message);
    // Wait for transaction to be mined
    await tx.wait();
  };

  return {
    contract,
    chainId: contract.provider.network?.chainId,
    getComments,
    addComment,
  };
};

export default useCommentsContract;
