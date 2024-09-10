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

const protocols = ["Arbitrum", "SUI", "Aptos", "Neutron"];

export default function Home() {
  const [protocol, setProtocol] = useState(protocols[0]);
  const [animation, setAnimation] = useState(false);
  const [value, setValue] = useState<{
    transaction: string;
    protocol: string | null;
    network: string | null;
  }>({
    transaction: "",
    protocol: null,
    network: null,
  });

  const selectRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>
  ) => {
    // if (event.key === "Enter") {
    //   if (!value.protocol && selectRef.current) {
    //     const keyboardEvent = new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true });
    //     selectRef.current.focus();
    //     selectRef.current.dispatchEvent(keyboardEvent);
    //   } else if (value.transaction === "" && value.protocol && inputRef.current) {
    //     inputRef.current.focus();
    //     event.stopPropagation();
    //     event.preventDefault();
    //   } else {
    //     router.push(`/verification?protocol=${value.protocol}&transaction=${value.transaction}`);
    //   }
    // }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setAnimation(true);
      setTimeout(() => {
        setProtocol((prevProtocol) => {
          const index = protocols.indexOf(prevProtocol);
          return protocols[(index + 1) % protocols.length];
        });
        setAnimation(false);
      }, 500);
    }, 1500);

    return () => clearInterval(intervalId);
  }, [protocol]);

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
          {protocol}
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
        <Select>
          <SelectTrigger
            ref={selectRef}
            className="w-[180px] rounded-none border-x-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            onKeyDown={handleKeyDown}
          >
            <SelectValue placeholder="Select a Protocol" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Protocols</SelectLabel>
              {protocols.map((item) => (
                <SelectItem
                  key={item}
                  value={item.toLowerCase()}
                  onClick={() =>
                    setValue((prevValue) => ({
                      ...prevValue,
                      protocol: item.toLowerCase(),
                    }))
                  }
                  onKeyDown={() =>
                    setValue((prevValue) => ({
                      ...prevValue,
                      protocol: item.toLowerCase(),
                    }))
                  }
                >
                  {item}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger
            ref={selectRef}
            className="w-[180px] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-100 disabled:text-muted"
            disabled={true}
            onKeyDown={handleKeyDown}
          >
            <SelectValue placeholder="Select a Network" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Networks</SelectLabel>
              {protocols.map((item) => (
                <SelectItem
                  key={item}
                  value={item.toLowerCase()}
                  onClick={() =>
                    setValue((prevValue) => ({
                      ...prevValue,
                      protocol: item.toLowerCase(),
                    }))
                  }
                  onKeyDown={() =>
                    setValue((prevValue) => ({
                      ...prevValue,
                      protocol: item.toLowerCase(),
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
            onClick={() =>
              router.push(
                `/verification?protocol=${value.protocol}&transaction=${value.transaction}`
              )
            }
          >
            verify
          </Button>
        </Select>
      </div>
    </div>
  );
}
