'use client';
import { MouseEventHandler, useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Info } from 'lucide-react';
import React from 'react';
import EthFrontImage from '@/public/images/nfts/veriwell-nft-eth.jpg';
import EthBack1Image from '@/public/images/nfts/veriwell-nft-eth-1.jpg';
import EthBack2Image from '@/public/images/nfts/veriwell-nft-eth-2.jpg';
import ArbitrumFrontImage from '@/public/images/nfts/veriwell-nft-arbitrum.jpg';
import ArbitrumBack1Image from '@/public/images/nfts/veriwell-nft-arbitrum-1.jpg';
import ArbitrumBack2Image from '@/public/images/nfts/veriwell-nft-arbitrum-2.jpg';
import StarknetFrontImage from '@/public/images/nfts/veriwell-nft-starknet.jpg';
import StarknetBack1Image from '@/public/images/nfts/veriwell-nft-starknet-1.jpg';
import StarknetBack2Image from '@/public/images/nfts/veriwell-nft-starknet-2.jpg';

interface NFTModalProps {
  chain: 'ethereum' | 'arbitrum' | 'starknet';
}

export default function NFTModal({ chain }: NFTModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsFlipped(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Info className="w-4 h-4 text-gray-400" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>NFT</DialogTitle>
          <DialogDescription>You can get NFT if you verify contract.</DialogDescription>
        </DialogHeader>
        <Card>
          <CardContent className="pt-6">
            <NftCard chain={chain} isOpen={isOpen} />
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

export const NftCard = ({ chain, isOpen }: { chain: 'ethereum' | 'arbitrum' | 'starknet'; isOpen: boolean }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const overRayRef = React.useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const frontImage = useMemo(() => {
    switch (chain) {
      case 'ethereum':
        return EthFrontImage;
      case 'arbitrum':
        return ArbitrumFrontImage;
      case 'starknet':
        return StarknetFrontImage;
    }
  }, [chain]);

  const backImage = useMemo(() => {
    const random = Math.random();
    switch (chain) {
      case 'ethereum':
        return random > 0.5 ? EthBack1Image : EthBack2Image;
      case 'arbitrum':
        return random > 0.5 ? ArbitrumBack1Image : ArbitrumBack2Image;
      case 'starknet':
        return random > 0.5 ? StarknetBack1Image : StarknetBack2Image;
    }
  }, [chain]);

  useEffect(() => {
    if (!isOpen) {
      setIsFlipped(false);
    }
  }, [isOpen]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateX = (4 / 30) * y - 20;
      const rotateY = (-1 / 5) * x + 20;

      const calculatedRotateY = isFlipped ? 180 + rotateY : rotateY;
      containerRef.current.style.transform = `perspective(350px) rotateX(${rotateX}deg) rotateY(${calculatedRotateY}deg)`;
      if (overRayRef.current) {
        overRayRef.current.style.backgroundPosition = `${x / 5 + y / 5}%`;
        overRayRef.current.style.filter = `opacity(${x / 200}) brightness(1.2)`;
      }
    }
  };

  const handleMouseOut: MouseEventHandler<HTMLDivElement> = () => {
    if (containerRef.current) {
      containerRef.current.style.transform = `perspective(350px) rotateX(0deg) rotateY(${isFlipped ? 180 : '0'}deg)`;
    }
  };

  const handleClickNft = () => {
    if (containerRef.current) {
      containerRef.current.style.transform = `perspective(350px) rotateX(0deg) rotateY(${!isFlipped ? 180 : '0'}deg)`;
    }
    setIsFlipped((prev) => !prev);
  };
  return (
    <div className="flex flex-col items-center space-y-4 cursor-pointer">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseOut={handleMouseOut}
        onClick={handleClickNft}
        style={{
          transition: 'all 0.1s',
          position: 'relative',
          width: '320px',
          height: '457px',
          transformStyle: 'preserve-3d',
          opacity: 0,
        }}
      >
        <div
          ref={overRayRef}
          style={{
            position: 'absolute',
            width: '320px',
            height: '457px',
            background:
              'linear-gradient(105deg, transparent 40%, rgba(255, 219, 112, 0.8) 45%, rgba(132, 50, 255, 0.7) 50%, transparent 58%)',
            filter: 'brightness(1.1) opacity(0.8)',
            mixBlendMode: 'overlay',
            backgroundSize: '150% 150%',
            backgroundPosition: '100%',
            transition: 'all 0.1s',
            zIndex: 1,
          }}
        />
        <Image
          src={frontImage}
          alt="NFT 이미지"
          width={320}
          height={457}
          className="rounded-lg"
          style={{
            position: 'absolute',
            backfaceVisibility: 'hidden',
          }}
          onLoadingComplete={() => {
            if (containerRef.current) {
              containerRef.current.style.opacity = '1';
            }
          }}
        />
        <Image
          src={backImage}
          alt="NFT 이미지"
          width={320}
          height={457}
          className="rounded-lg"
          style={{
            position: 'absolute',
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
          }}
        />
      </div>
    </div>
  );
};
