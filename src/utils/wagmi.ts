import { createConfig } from "wagmi";
import { http } from "viem";
import { dedicatedWalletConnector } from "@magiclabs/wagmi-connector";
import { bscTestnet } from "viem/chains";
import { injected } from "wagmi/connectors";

export const magicConnector = dedicatedWalletConnector({
  chains: [bscTestnet],
  options: {
    apiKey: import.meta.env.VITE_MAGIC_API_KEY,
    isDarkMode: true,
    oauthOptions: {
      providers: ["google"],
    },
    magicSdkConfiguration: {
      network: {
        rpcUrl: import.meta.env.VITE_RPC_URL,
        chainId: bscTestnet.id,
      },
    },
  },
});

export const wagmiConfig = createConfig({
  chains: [bscTestnet],
  transports: {
    [bscTestnet.id]: http(import.meta.env.VITE_RPC_URL),
  },
  connectors: [injected({ target: "metaMask" }), magicConnector],
});
