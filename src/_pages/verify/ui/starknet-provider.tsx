import { connect } from "get-starknet";
import { createContext, use, useContext, useState } from "react";
import { RpcProvider, WalletAccount } from "starknet";

const StarknetProviderContext = createContext<{
  walletAccount: WalletAccount | null;
  connectWallet: (chain: "mainnet" | "sepolia") => Promise<void>;
  provider: RpcProvider;
}>({
  walletAccount: null,
  connectWallet: async () => {},
  provider: new RpcProvider({
    nodeUrl: process.env.NEXT_PUBLIC_STARKNET_MAINNET_URL,
  }),
});

interface StarknetProviderProps {
  children: React.ReactNode;
}

export const StarknetProvider: React.FC<StarknetProviderProps> = ({
  children,
}) => {
  const provider = new RpcProvider({
    nodeUrl: `${process.env.NEXT_PUBLIC_STARKNET_SEPOLIA_URL}`,
  });
  const [walletAccount, setWalletAccount] = useState<WalletAccount | null>(
    null
  );

  const connectWallet = async (chain: "mainnet" | "sepolia") => {
    const selectedWalletSWO = await connect({
      modalMode: "alwaysAsk",
      modalTheme: "light",
    });
    if (!selectedWalletSWO) {
      return;
    }
    const _walletAccount = new WalletAccount(
      {
        nodeUrl:
          chain === "mainnet"
            ? process.env.NEXT_PUBLIC_STARKNET_MAINNET_URL
            : process.env.NEXT_PUBLIC_STARKNET_SEPOLIA_URL,
      },
      selectedWalletSWO
    );
    setWalletAccount(_walletAccount);
  };

  const value = { walletAccount, connectWallet, provider };

  return (
    <StarknetProviderContext.Provider value={value}>
      {children}
    </StarknetProviderContext.Provider>
  );
};

export const useStarknetProvider = () => {
  const value = useContext(StarknetProviderContext);
  if (!value) {
    throw new Error(
      "useStarknetProvider must be used within a StarknetProvider"
    );
  }
  return value;
};
