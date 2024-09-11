"use client";
import { useEffect, useRef, useState } from "react";
import { LatestVerification } from "@/src/widgets/Landing";
import { createConfig, http, WagmiProvider } from "wagmi";
import { arbitrum, arbitrumSepolia, mainnet, sepolia } from "viem/chains";
import { SearchContract } from "@/src/widgets/Landing/ui/search-contract";

const chains = ["Arbitrum", "SUI", "Aptos", "Neutron"];

export const config = createConfig({
  chains: [arbitrum, arbitrumSepolia],
  transports: {
    [arbitrum.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
});

export default function HomeWrapper() {
  return (
    <WagmiProvider config={config}>
      <Home />
    </WagmiProvider>
  );
}

function Home() {
  const [chain, setChain] = useState(chains[0]);
  const [animation, setAnimation] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setAnimation(true);
      setTimeout(() => {
        setChain((prevProtocol) => {
          const index = chains.indexOf(prevProtocol);
          return chains[(index + 1) % chains.length];
        });
        setAnimation(false);
      }, 500);
    }, 1500);

    return () => clearInterval(intervalId);
  }, [chain]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center flex-1 px-4 text-center">
      <h1 className="w-[660px] flex gap-4 text-4xl font-bold">
        Multichain Verificator for{" "}
        <div
          className={`text-blue-500 transition-all duration-500 ${
            animation ? "fade-out-up" : "fade-in-down"
          }`}
        >
          {chain}
        </div>
      </h1>
      <div className="relative mx-auto mt-12 flex rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50">
        <SearchContract />
      </div>
      <div className="mt-12">
        <LatestVerification />
      </div>
    </div>
  );
}
