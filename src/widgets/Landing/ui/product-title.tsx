'use client';
import { useEffect, useRef, useState } from 'react';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { arbitrum, arbitrumSepolia, mainnet, sepolia } from 'viem/chains';
import EthereumLogo from '@/public/images/chainLogos/ethereum.png';
import ArbitrumLogo from '@/public/images/chainLogos/arbitrum.png';
import StarknetLogo from '@/public/images/chainLogos/starknet.png';
import Image, { StaticImageData } from 'next/image';

const chains = [EthereumLogo, ArbitrumLogo, StarknetLogo];
// TODO: add ["SUI", "Aptos", "Neutron"];

export const config = createConfig({
  chains: [arbitrum, arbitrumSepolia],
  transports: {
    [arbitrum.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
});

export default function ProductTitle() {
  const [chain, setChain] = useState<StaticImageData>(chains[0]);
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
    <div className="flex flex-col justify-center items-center gap-4">
      <h1 className="flex gap-4 text-3xl font-bold">Multi-language, Open Source, Verify Well for </h1>
      <h1 className="flex gap-4 justify-center items-center text-3xl font-bold h-[80px]">
        {'{'}
        <div className={`text-blue-500 transition-all duration-500 ${animation ? 'fade-out-up' : 'fade-in-down'}`}>
          <Image width={200} src={chain} alt="chain" />
        </div>
        {'}'}
      </h1>
    </div>
  );
}
