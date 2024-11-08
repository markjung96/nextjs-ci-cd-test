'use client';
import { use, useEffect, useRef, useState } from 'react';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { arbitrum, arbitrumSepolia, mainnet, sepolia } from 'viem/chains';
import EthereumLogo from '@/public/images/chainLogos/ethereum.png';
import EthereumLogoLight from '@/public/images/chainLogos/ethereum-light.svg';
import ArbitrumLogo from '@/public/images/chainLogos/arbitrum.png';
import ArbitrumLogoLight from '@/public/images/chainLogos/arbitrum-light.svg';
import StarknetLogo from '@/public/images/chainLogos/starknet.svg';
import StarknetLogoLight from '@/public/images/chainLogos/starknet-light.svg';
import Image, { StaticImageData } from 'next/image';
import { useTheme } from 'next-themes';

const chains = [
  { dark: EthereumLogoLight, light: EthereumLogo },
  { dark: ArbitrumLogoLight, light: ArbitrumLogo },
  { dark: StarknetLogoLight, light: StarknetLogo },
];
// TODO: add ["SUI", "Aptos", "Neutron"];

export const config = createConfig({
  chains: [arbitrum, arbitrumSepolia],
  transports: {
    [arbitrum.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
});

export default function ProductTitle() {
  const { theme } = useTheme();
  const [chain, setChain] = useState<{ dark: StaticImageData; light: StaticImageData }>(chains[0]);
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
      <h1 className="flex gap-4 text-4xl font-bold">Multi-language, Open Source, Verify Well for </h1>
      <h1 className="flex gap-4 justify-center items-center text-4xl font-bold h-[80px]">
        {'{'}
        <div className={`text-blue-500 transition-all duration-500 ${animation ? 'fade-out-up' : 'fade-in-down'}`}>
          <Image width={240} src={theme === 'dark' ? chain.dark : chain.light} alt="chain" />
        </div>
        {'}'}
      </h1>
    </div>
  );
}
