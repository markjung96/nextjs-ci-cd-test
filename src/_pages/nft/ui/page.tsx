'use client';
import '@rainbow-me/rainbowkit/styles.css';
import { useEffect, useState } from 'react';
import { http, useAccount, WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectButton, getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configViem } from '../../verify/ui/contract-interact';
import { readContract } from '@wagmi/core';
import abi from '../const/erc-721.json';
import { arbitrum, arbitrumSepolia, mainnet, sepolia } from 'wagmi/chains';
import { NftCard } from '../../verify/ui/nft-modal';

const queryClient = new QueryClient();

const getConfig = (chain: string, network: string) => {
  let chains: any = [];
  let transports = {};
  switch (`${chain}/${network}`) {
    case 'ethereum/mainnet':
      chains = [mainnet];
      transports = {
        [mainnet.id]: http(process.env.NEXT_PUBLIC_ETHEREUM_MAINNET_URL),
      };
      break;
    case 'ethereum/sepolia':
      chains = [sepolia];
      transports = {
        [sepolia.id]: http(process.env.NEXT_PUBLIC_ETHEREUM_SEPOLIA_URL),
      };
      break;
    case 'arbitrum/one':
      chains = [arbitrum];
      transports = {
        [arbitrum.id]: http(process.env.NEXT_PUBLIC_ARBITRUM_ONE_URL),
      };
      break;
    case 'arbitrum/sepolia':
      chains = [arbitrumSepolia];
      transports = {
        [arbitrumSepolia.id]: http(process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_URL),
      };
      break;

    default:
      break;
  }
  return getDefaultConfig({
    appName: 'Arbitrum Sepolia',
    projectId: process.env.NEXT_PUBLIC_WALLET_PROJECT_ID!,
    chains,
    multiInjectedProviderDiscovery: false,
    transports,
    ssr: true,
  });
};

export const NftPage = () => {
  const chain = 'arbitrum';
  const network = 'sepolia';
  const config = getConfig(chain, network);
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact">
          <div className="max-w-5xl w-full p-6 rounded-lg border-black dark:border-white border-[3px]">
            <h1 className="text-2xl font-bold text-center mb-2">Your NFTs</h1>
            <p className="text-center  mb-6">NFT for verifying contracts. VeriWell!</p>
            <div className="flex w-full flex-col justify-center gap-4">
              <NftView />
            </div>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

const NftView = () => {
  const { isConnected, address } = useAccount();
  const [nfts, setNfts] = useState<{ imageUri: string }[]>([]);
  const getBalance = async (_address: string) => {
    const res = await readContract(configViem, {
      abi,
      address: '0x14757FB567b06c44F929b4406Eb1f3F5C8Bf8477',
      functionName: 'balanceOf',
      args: [_address],
      chainId: arbitrumSepolia.id,
    });
    const _nftCount = Number(res);
    const nfts = Array.from({ length: _nftCount }).map((_, index) => ({
      imageUri: 'https://veriwell-nft.s3.us-east-1.amazonaws.com/veriwell-nft-arbitrum.jpg',
    }));
    setNfts(nfts);
  };

  useEffect(() => {
    if (address) {
      getBalance(address);
    }
  }, [address]);

  if (!isConnected) {
    return (
      <div className="flex justify-center">
        <ConnectButton showBalance={false} />
      </div>
    );
  }

  return (
    <>
      {nfts.length > 0 ? (
        <div className="flex flex-row gap-4">
          {nfts.map((nft, index) => (
            <div key={index}>
              <NftCard chain="arbitrum" isOpen={true} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-32">
          <p className="text-lg text-gray-500">No NFTs found</p>
        </div>
      )}
    </>
  );
};
