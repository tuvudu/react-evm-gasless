import { ABI, ForwarderAbi } from "../utils/abi";

import { useAccount, useSignMessage, useWalletClient } from "wagmi";
import { readContract } from "wagmi/actions";
import { encodeFunctionData } from "viem";
import { wagmiConfig } from "../utils/wagmi";
import { bscTestnet } from "viem/chains";

const domain = {
  name: "GSNv2 Forwarder",
  version: "0.0.1",
  chainId: 97,
  verifyingContract: import.meta.env.VITE_FORWARDER_CONTRACT,
} as const;

const types = {
  ForwardRequest: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "gas", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "data", type: "bytes" },
  ],
  Execute: [
    { name: "req", type: "ForwardRequest" },
    { name: "signature", type: "bytes" },
  ],
};

export default function MintToken() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient({
    account: address,
    chainId: bscTestnet.id,
  });

  const { data, signMessage } = useSignMessage();

  console.log("signature: ", data);

  console.log("walletClient", walletClient);
  console.log("address:", address, isConnected);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMint = async (request: any) => {
    const nonce = await readContract(wagmiConfig, {
      abi: ForwarderAbi,
      address: import.meta.env.VITE_FORWARDER_CONTRACT,
      functionName: "getNonce",
      args: [request.from],
    });

    request.nonce = Number(nonce);

    console.log("data", nonce, request);

    const signature = await walletClient?.signTypedData({
      account: address,
      primaryType: "ForwardRequest",
      domain,
      types,
      message: request,
    });

    console.log("signature", signature);

    const result = await readContract(wagmiConfig, {
      abi: ForwarderAbi,
      address: import.meta.env.VITE_FORWARDER_CONTRACT,
      functionName: "verify",
      args: [request, signature],
    });

    console.log("result", result);

    console.time("mintTime");
    const response = await fetch(import.meta.env.VITE_OPENZEPPLIN_ACTION_UR, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        request,
        signature,
        forwarderAddress: import.meta.env.VITE_FORWARDER_CONTRACT,
        type: "forward",
      }),
    });
    console.timeEnd("mintTime");

    const txResponse = await response.json();

    console.log("response", txResponse);
  };

  return (
    <>
      <button
        onClick={() => {
          const data = encodeFunctionData({
            abi: ABI,
            functionName: "mint",
            args: [address, "1000000000"],
          });

          handleMint({
            to: import.meta.env.VITE_TOKEN_CONTRACT,
            from: address,
            data,
            gas: "1000000",
            value: "0",
          });
        }}
      >
        Mint
      </button>
      <button
        onClick={() => {
          signMessage({ message: "hello world" });
        }}
      >
        sign
      </button>
    </>
  );
}
