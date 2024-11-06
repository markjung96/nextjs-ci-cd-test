"use client";
import { MouseEventHandler, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Info } from "lucide-react";
import React from "react";
import NFTEthereumFront from "@/public/images/veriwell-branding-08.jpg";
import NFTEthereumBack from "@/public/images/veriwell-branding-14.jpg";

export default function NFTModal() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const overRayRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const rotateY = (-1 / 5) * x + 20;
    const rotateX = (4 / 30) * y - 20;
    const containerStyle = `perspective(350px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    if (containerRef.current) {
      containerRef.current.style.transform = containerStyle;
    }
    // const overRayStyle = `${
    //   x / 5 + y / 5
    // }%; filter : opacity(${x / 200}) brightness(1.2)`;
    if (overRayRef.current) {
      overRayRef.current.style.backgroundPosition = `${x / 5 + y / 5}%`;
      overRayRef.current.style.filter = `opacity(${x / 200}) brightness(1.2)`;
    }
  };

  const handleMouseOut: MouseEventHandler<HTMLDivElement> = () => {
    if (containerRef.current) {
      containerRef.current.style.transform =
        "perspective(350px) rotateX(0deg) rotateY(0deg)";
    }
    // if (overRayRef.current) {
    //   overRayRef.current.style.cssText = "filter : opacity(0)";
    // }
  };

  const handleClickNft = () => {
    const containerStyle = `perspective(350px) rotateY(180deg)`;
    if (containerRef.current) {
      console.log(
        "containerRef.current.style.transform",
        containerRef.current.style.transform
      );
      containerRef.current.style.transform = containerStyle;
    }
    console.log("click nft");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Info className="w-4 h-4 text-gray-400" />
        {/* <Button variant="outline">NFT 정보 보기</Button> */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>NFT</DialogTitle>
          <DialogDescription>
            You can get NFT if you verify contract.
          </DialogDescription>
        </DialogHeader>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseOut={handleMouseOut}
                onClick={handleClickNft}
                style={{
                  transition: "all 0.1s",
                  position: "relative",
                  width: "320px",
                  height: "457px",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  ref={overRayRef}
                  style={{
                    position: "absolute",
                    width: "320px",
                    height: "457px",
                    background:
                      "linear-gradient(105deg, transparent 40%, rgba(255, 219, 112, 0.8) 45%, rgba(132, 50, 255, 0.6) 50%, transparent 54%)",
                    filter: "brightness(1.1) opacity(0.8)",
                    mixBlendMode: "color-dodge",
                    backgroundSize: "150% 150%",
                    backgroundPosition: "100%",
                    transition: "all 0.1s",
                    zIndex: 1,
                    backfaceVisibility: "hidden",
                  }}
                />
                <Image
                  src={NFTEthereumFront}
                  alt="NFT 이미지"
                  width={320}
                  height={457}
                  className="rounded-lg"
                  style={{
                    position: "absolute",
                    backfaceVisibility: "hidden",
                  }}
                />
                <Image
                  src={NFTEthereumBack}
                  alt="NFT 이미지"
                  width={320}
                  height={457}
                  className="rounded-lg"
                  style={{
                    position: "absolute",
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
