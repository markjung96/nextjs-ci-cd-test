"use client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/src/shared/ui";
import { getBytecode, createConfig } from "@wagmi/core";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useMemo } from "react";
import {
  http,
  WagmiProvider,
  createConfig as createConfigGeneral,
} from "wagmi";
import { arbitrum, arbitrumSepolia, mainnet, sepolia } from "viem/chains";
import _ from "lodash";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const configGeneral = createConfigGeneral({
  chains: [mainnet, sepolia, arbitrum, arbitrumSepolia],
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(process.env.NEXT_PUBLIC_ETHEREUM_SEPOLIA_URL),
    [arbitrum.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
});

export const config = createConfig({
  chains: [mainnet, sepolia, arbitrum, arbitrumSepolia],
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(process.env.NEXT_PUBLIC_ETHEREUM_SEPOLIA_URL),
    [arbitrum.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
});

export function SearchContractWrapper() {
  return (
    <WagmiProvider config={configGeneral}>
      <SearchContract />
    </WagmiProvider>
  );
}

const getSuggestionsList = async (address: string) => {
  // TODO: Add other chains here
  const chainIds = [mainnet.id, sepolia.id, arbitrum.id, arbitrumSepolia.id];

  try {
    // starknet suggestion
    const networks = [
      {
        network: "mainnet",
        url: process.env.NEXT_PUBLIC_STARKNET_MAINNET_URL,
      },
      {
        network: "sepolia",
        url: process.env.NEXT_PUBLIC_STARKNET_SEPOLIA_URL,
      },
    ];
    const starknetSuggestion = await Promise.all(
      networks.map(async (network) => {
        const starknetSuggestionsRaw = await fetch(network.url!, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "starknet_getClassHashAt",
            params: ["latest", address],
            id: 1,
          }),
        });
        const starknetSuggestions = await starknetSuggestionsRaw.json();
        if (starknetSuggestions.error) {
          console.error(
            "Error getting starknet suggestions",
            starknetSuggestions
          );
          return null;
        } else {
          return {
            chainName: "Starknet",
            networkName: network.network,
            isContract: starknetSuggestions.result !== "0x",
            address,
          };
        }
      })
    );

    // starknet 주소가 있으면 starknet suggestion만 반환
    if (
      starknetSuggestion.filter((suggestion) => suggestion !== null).length > 0
    ) {
      return starknetSuggestion.filter((suggestion) => suggestion !== null);
    }

    const suggestions = await Promise.all(
      chainIds.map((chainId) => {
        return getBytecode(config, {
          chainId,
          address: address as `0x${string}`,
        });
      })
    );

    return suggestions
      .map((suggestion, index) => {
        let chainName = "";
        let networkName = "";
        // TODO: Add other chains here
        switch (chainIds[index]) {
          case mainnet.id:
            chainName = "Ethereum";
            networkName = "Mainnet";
            break;
          case sepolia.id:
            chainName = "Ethereum";
            networkName = "Sepolia";
            break;
          case arbitrum.id:
            chainName = "Arbitrum";
            networkName = "One";
            break;
          case arbitrumSepolia.id:
            chainName = "Arbitrum";
            networkName = "Sepolia";
            break;
        }
        return {
          chainName,
          networkName,
          isContract: suggestion !== undefined && suggestion !== "0x",
          address,
          // suggestion,
        };
      })
      .filter((suggestion) => suggestion.isContract);
  } catch (error) {
    console.error("Error getting suggestions", error);
    return [];
  }
};

export function SearchContract() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<
    {
      chainName: string;
      networkName: string;
      isContract: boolean;
      address: string;
    }[]
  >([]);

  // debounce 최적화
  const debouncedSearch = useMemo(
    () =>
      _.debounce(async (address) => {
        setIsLoading(true);
        const suggestions = await getSuggestionsList(address);
        setSuggestions(suggestions);
        setIsLoading(false);
      }, 300),
    []
  );

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setIsOpen(true);
    const address = event.currentTarget.value;
    debouncedSearch(address);
  };

  const handleClickSuggestion = (suggestion: {
    chainName: string;
    networkName: string;
    isContract: boolean;
    address: string;
  }) => {
    router.push(
      `/verify?chain=${suggestion.chainName.toLowerCase()}&network=${suggestion.networkName.toLowerCase()}&contractAddress=${
        suggestion.address
      }`
    );
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} defaultOpen>
      <PopoverTrigger asChild>
        <div onClick={(event) => event.preventDefault()}>
          <SearchIcon className="absolute left-3 top-[50%] translate-y-[-50%] h-5 w-5" />
          <Input
            type="text"
            placeholder="Search by Address, Transaction, Token"
            className="pl-10 pr-10 py-2 w-[480px] rounded-tl-md rounded-bl-md focus-visible:ring-0 focus-visible:ring-offset-0"
            onChange={handleChange}
            onClick={() => setIsOpen(true)}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[480px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>
              {isLoading ? (
                <div className="flex justify-center">
                  <LoadingSpinner />
                </div>
              ) : (
                "No results found."
              )}
            </CommandEmpty>
            <CommandGroup heading="Suggestions">
              {suggestions.map((suggestion, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => handleClickSuggestion(suggestion)}
                >
                  {`${suggestion.chainName} ${suggestion.networkName}`}{" "}
                  {suggestion.address}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
