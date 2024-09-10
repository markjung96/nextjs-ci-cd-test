"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";

import { Input } from "@/src/shared/ui/input";
import {
  Button,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/ui";

const chains = ["Arbitrum", "SUI", "Aptos", "Neutron"];
const networks = [{ chain: "arbitrum", networks: ["sepolia"] }];

export default function Home() {
  const [chain, setProtocol] = useState(chains[0]);
  const [animation, setAnimation] = useState(false);
  const [value, setValue] = useState<{
    transaction: string;
    chain: string | null;
    network: string | null;
  }>({
    transaction: "",
    chain: null,
    network: null,
  });

  const selectRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>
  ) => {
    // if (event.key === "Enter") {
    //   if (!value.chain && selectRef.current) {
    //     const keyboardEvent = new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true });
    //     selectRef.current.focus();
    //     selectRef.current.dispatchEvent(keyboardEvent);
    //   } else if (value.transaction === "" && value.chain && inputRef.current) {
    //     inputRef.current.focus();
    //     event.stopPropagation();
    //     event.preventDefault();
    //   } else {
    //     router.push(`/verification?chain=${value.chain}&transaction=${value.transaction}`);
    //   }
    // }
  };

  const handleClickSearch = () => {
    if (value.chain === "arbitrum") {
      router.push(`/verify?contractAddress=${value.transaction}`);
    } else {
      router.push(
        `/verification?chain=${value.chain}&transaction=${value.transaction}`
      );
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setAnimation(true);
      setTimeout(() => {
        setProtocol((prevProtocol) => {
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
        <SearchIcon className="absolute left-3 top-[50%] translate-y-[-50%] h-5 w-5" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search by Address, Transaction, Token"
          className="pl-10 pr-10 py-2 w-[480px] rounded-tl-md rounded-bl-md rounded-tr-none rounded-br-none focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(event) => {
            setValue((prevValue) => ({
              ...prevValue,
              transaction: event.target.value,
            }));
          }}
          onKeyDown={handleKeyDown}
        />
        <Select
          onValueChange={(value) =>
            setValue((prevValue) => ({
              ...prevValue,
              chain: value,
            }))
          }
        >
          <SelectTrigger
            ref={selectRef}
            className="w-[180px] rounded-none border-x-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            onKeyDown={handleKeyDown}
          >
            <SelectValue placeholder="Select a Chain" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>chains</SelectLabel>
              {chains.map((item) => (
                <SelectItem
                  key={item}
                  value={item.toLowerCase()}
                  onKeyDown={() =>
                    setValue((prevValue) => ({
                      ...prevValue,
                      chain: item.toLowerCase(),
                    }))
                  }
                >
                  {item}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) =>
            setValue((prevValue) => ({
              ...prevValue,
              network: value,
            }))
          }
        >
          <SelectTrigger
            ref={selectRef}
            className="w-[180px] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-100 disabled:text-muted"
            onKeyDown={handleKeyDown}
            disabled={
              networks.filter((chainInfo) => chainInfo.chain === value.chain)
                .length === 0
            }
          >
            <SelectValue placeholder="Select a Network" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Networks</SelectLabel>
              {networks.filter((chainInfo) => chainInfo.chain === value.chain)
                .length !== 0 &&
                networks
                  .filter((chainInfo) => chainInfo.chain === value.chain)[0]
                  .networks.map((item) => (
                    <SelectItem
                      key={item}
                      value={item.toLowerCase()}
                      onKeyDown={() =>
                        setValue((prevValue) => ({
                          ...prevValue,
                          chain: item.toLowerCase(),
                        }))
                      }
                    >
                      {item}
                    </SelectItem>
                  ))}
            </SelectGroup>
          </SelectContent>
          <Button
            className="rounded-l-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-100 disabled:text-muted"
            onClick={handleClickSearch}
          >
            Search
          </Button>
        </Select>
      </div>
    </div>
  );
}
