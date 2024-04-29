// This uses NextJS's `"use client"` functionality which declares that a component is only to be rendered client-side.
// https://nextjs.org/docs/app/building-your-application/rendering/client-components
"use client";

import {
  Asset,
  Environment,
  MesoEvent,
  Network,
  transfer,
  TransferInstance,
} from "@meso-network/meso-js";
import { useCallback, useState } from "react";

export const BuyCrypto = () => {
  const [mesoTransfer, setMesoTransfer] = useState<TransferInstance>();

  const handleBuyCrypto = useCallback(async () => {
    const mesoTransferInstance = transfer({
      partnerId: "<PARTNER_ID>", // Your unique Meso partner ID
      environment: Environment.SANDBOX, // SANDBOX | PRODUCTION
      sourceAmount: "100", // The amount (in USD) the user will spend
      destinationAsset: Asset.ETH, // The token the user will receive ("ETH" | "SOL" | "USDC")
      network: Network.ETHEREUM_MAINNET, // The network to use for the transfer
      walletAddress: "<WALLET_ADDRESS>", // The user's wallet address obtained at runtime by your application

      // A callback to handle events throughout the integration lifecycle
      onEvent({ kind, payload }: MesoEvent) {
        // Handle events here...
        console.log(kind, payload);
      },

      // A callback to handle having the user verify their wallet ownership by signing a message
      async onSignMessageRequest(message: string) {
        // Have the user sign a message via their wallet and return the result.
        // It is up to you to implement message signing.
        return undefined;
      },
    });

    setMesoTransfer(mesoTransferInstance);
  }, []);

  useCallback(() => {
    // Destroy the Meso transfer instance when this component is unmounted
    return () => {
      if (mesoTransfer) {
        console.log("destroying meso transfer instance");
        mesoTransfer.destroy();
      }
    };
  }, [mesoTransfer]);

  return (
    <button
      onClick={handleBuyCrypto}
      style={{
        backgroundColor: "purple",
        color: "white",
        padding: "0.2em",
        borderRadius: "0.5em",
      }}
    >
      Buy Crypto
    </button>
  );
};
