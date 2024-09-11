import { config } from "@/app/page";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button, Input } from "@/src/shared/ui";
import { getBytecode } from "@wagmi/core";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { arbitrumSepolia } from "viem/chains";

const getSuggestionsList = async (address: string) => {
  // TODO: Add other chains here
  const chainIds = [arbitrumSepolia.id];

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
        case arbitrumSepolia.id:
          chainName = "Arbitrum";
          networkName = "Sepolia";
          break;
      }
      return {
        chainName,
        networkName,
        isContract: suggestion !== "0x",
        address,
        // suggestion,
      };
    })
    .filter((suggestion) => suggestion.isContract);
};

export function SearchContract() {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<
    {
      chainName: string;
      networkName: string;
      isContract: boolean;
      address: string;
    }[]
  >([]);

  const handleEnter = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setIsOpen(true);
      const address = event.currentTarget.value;
      const suggestions = await getSuggestionsList(address);
      setSuggestions(suggestions);
    }
  };

  const handleClickSuggestion = (suggestion: {
    chainName: string;
    networkName: string;
    isContract: boolean;
    address: string;
  }) => {
    if (
      suggestion.chainName === "Arbitrum" &&
      suggestion.networkName === "Sepolia"
    ) {
      router.push(`/verify?contractAddress=${suggestion.address}`);
    } else {
      router.push(
        `/verification?chain=${suggestion.chainName}&network=${suggestion.networkName}&transaction=${suggestion.address}`
      );
    }
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
            onKeyDown={handleEnter}
            onClick={() => setIsOpen(true)}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[480px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
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
            {/* <CommandGroup heading="Verify">
              <CommandItem>
                <span>Verifiy</span>
              </CommandItem>
            </CommandGroup> */}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
