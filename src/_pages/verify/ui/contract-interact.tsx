"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { Dispatch, FC, SetStateAction, useState } from "react";
import JSZip from "jszip";
import { useEffect } from "react";
import * as React from "react";
import { Button, Input, Label } from "@/src/shared/ui";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { http, WagmiProvider, useAccount, useWriteContract } from "wagmi";
import { arbitrum, arbitrumSepolia, mainnet, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, readContract } from "@wagmi/core";
import { Abi, AbiFunction, AbiParameter } from "viem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { switchChain } from "@wagmi/core";
import {
  getDefaultConfig,
  RainbowKitProvider,
  ConnectButton,
} from "@rainbow-me/rainbowkit";

const configViem = createConfig({
  chains: [mainnet, sepolia, arbitrumSepolia, arbitrum],
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [arbitrumSepolia.id]: http(),
    [arbitrum.id]: http(),
  },
});

const getConfig = (chain: string, network: string) => {
  let chains: any = [];
  let transports = {};
  switch (`${chain}/${network}`) {
    case "ethereum/mainnet":
      chains = [mainnet];
      transports = {
        [mainnet.id]: http(),
      };
      break;
    case "ethereum/sepolia":
      chains = [sepolia];
      transports = {
        [sepolia.id]: http(),
      };
      break;
    case "arbitrum/one":
      chains = [arbitrum];
      transports = {
        [arbitrum.id]: http(),
      };
      break;
    case "arbitrum/sepolia":
      chains = [arbitrumSepolia];
      transports = {
        [arbitrumSepolia.id]: http(),
      };
      break;

    default:
      break;
  }
  return getDefaultConfig({
    appName: "Arbitrum Sepolia",
    projectId: process.env.NEXT_PUBLIC_WALLET_PROJECT_ID!,
    chains,
    multiInjectedProviderDiscovery: false,
    transports,
    ssr: true,
  });
};

const queryClient = new QueryClient();

type File = {
  name: string;
  content: string;
};

const isFunctionFragment = (abi: AbiFunction | Abi): abi is AbiFunction =>
  (abi as AbiFunction).type === "function";

interface ContractInteractProps {
  chain: string;
  network: string;
  outFileUrl: string;
  contractAddress: string;
}

export const ContractInteract: FC<ContractInteractProps> = ({
  chain,
  network,
  outFileUrl,
  contractAddress,
}) => {
  const [abi, setAbi] = useState<Abi[]>([]);
  const [readAbiFragments, setReadAbiFragments] = useState<AbiFunction[]>([]);
  const [writeAbiFragments, setWriteAbiFragments] = useState<AbiFunction[]>([]);

  const processFiles = async (unzipped: any) => {
    const filePromises: any = [];

    unzipped.forEach((relativePath: any, file: any) => {
      if (!file.dir) {
        const filePromise = file.async("text").then((content: any) => {
          return { name: file.name, content: content };
        });
        filePromises.push(filePromise);
      }
    });

    const codes = await Promise.all(filePromises);
    return codes;
  };

  const config = getConfig(chain, network);

  const fetchZip = async (url: string) => {
    const zipFile = await fetch(url);
    const arrayBuffer = await zipFile.arrayBuffer();
    const zipBlob = new Blob([arrayBuffer], { type: "application/zip" });
    const zip = new JSZip();
    const unzippedFiles = await zip.loadAsync(zipBlob);
    const files: File[] = await processFiles(unzippedFiles);
    // const abiFile = files.find((file) => file.name === "output/abi.json");
    const abiFile = files.find((file) => file.name.includes("abi.json"));
    if (abiFile) {
      const totalAbi = JSON.parse(abiFile.content);
      const readAbi = totalAbi.filter(
        (abiItem: Abi) =>
          isFunctionFragment(abiItem) &&
          (abiItem.stateMutability === "view" ||
            abiItem.stateMutability === "pure")
      );
      const writeAbi = totalAbi.filter(
        (abiItem: Abi) =>
          isFunctionFragment(abiItem) &&
          abiItem.stateMutability !== "view" &&
          abiItem.stateMutability !== "pure"
      );
      setAbi(totalAbi);
      setReadAbiFragments(readAbi);
      setWriteAbiFragments(writeAbi);
    }
  };

  useEffect(() => {
    fetchZip(outFileUrl);
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact">
          <ConnectButtonWrapper chain={chain} network={network} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <Card>
              <CardHeader>
                <CardTitle>Get Functions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {readAbiFragments.map((abiItem, abiIndex) => {
                    if (isFunctionFragment(abiItem))
                      return (
                        <AccordionCard
                          chain={chain}
                          network={network}
                          abi={abi}
                          key={`Methods_A_${abiIndex}`}
                          contractAddress={contractAddress}
                          abiFragment={abiItem}
                          index={abiIndex}
                        />
                      );

                    return null;
                  })}
                </Accordion>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Set Functions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {writeAbiFragments.map((abiItem, abiIndex) => {
                    if (isFunctionFragment(abiItem))
                      return (
                        <AccordionCard
                          chain={chain}
                          network={network}
                          abi={abi}
                          key={`Methods_A_${abiIndex}`}
                          contractAddress={contractAddress}
                          abiFragment={abiItem}
                          index={abiIndex}
                        />
                      );

                    return null;
                  })}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

interface ConnectButtonWrapperProps {
  chain: string;
  network: string;
}

const ConnectButtonWrapper = ({
  chain,
  network,
}: ConnectButtonWrapperProps) => {
  const { isConnected, chainId } = useAccount();

  if (isConnected) {
    if (chain === "ethereum") {
      if (network === "mainnet" && chainId !== mainnet.id) {
        switchChain(configViem, { chainId: mainnet.id });
      } else if (network === "sepolia" && chainId !== sepolia.id) {
        switchChain(configViem, { chainId: sepolia.id });
      }
    }
    if (chain === "arbitrum") {
      if (network === "one" && chainId !== arbitrum.id) {
        switchChain(configViem, { chainId: arbitrum.id });
      } else if (network === "sepolia" && chainId !== arbitrumSepolia.id) {
        switchChain(configViem, { chainId: arbitrumSepolia.id });
      }
    }
  }

  return <ConnectButton showBalance={false} />;
};

interface AccordionCardProps {
  chain: string;
  network: string;
  abi: Abi[];
  abiFragment: AbiFunction;
  index: number;
  contractAddress: string;
}
const AccordionCard = ({
  chain,
  network,
  abi,
  abiFragment,
  index,
  contractAddress,
}: AccordionCardProps) => {
  const { data: hash, writeContract } = useWriteContract();
  const { isConnected, chainId } = useAccount();
  const [value, setValue] = useState<string>("");
  const [args, setArgs] = useState<{ [key: string]: string }>({});
  const isRightNetwork = React.useMemo(() => {
    if (chain === "ethereum" && network === "mainnet") {
      return chainId === mainnet.id;
    }
    if (chain === "ethereum" && network === "sepolia") {
      return chainId === sepolia.id;
    }
    if (chain === "arbitrum" && network === "one") {
      return chainId === arbitrum.id;
    }
    if (chain === "arbitrum" && network === "sepolia") {
      return chainId === arbitrumSepolia.id;
    }
    return false;
  }, [chain, network, chainId]);

  const getButtonVariant = (state: string = ""): string => {
    switch (state) {
      case "view":
      case "pure":
        return "primary";
      case "nonpayable":
        return "warning";
      case "payable":
        return "danger";
      default:
        break;
    }
    return "";
  };

  const handleCallOnClick = async () => {
    let chainId;
    switch (`${chain}/${network}`) {
      case "ethereum/mainnet":
        chainId = mainnet.id;
        break;
      case "ethereum/sepolia":
        chainId = sepolia.id;
        break;
      case "arbitrum/one":
        chainId = arbitrum.id;
        break;
      case "arbitrum/sepolia":
        chainId = arbitrumSepolia.id;
        break;
      default:
        break;
    }

    const parms: string[] = [];
    abiFragment.inputs?.forEach((item) => {
      parms.push(args[item.name!]);
    });

    try {
      const res = await readContract(configViem, {
        abi,
        address: contractAddress as `0x${string}`,
        functionName: abiFragment.name,
        args: parms,
        chainId,
      });
      let _value = "";
      switch (abiFragment.outputs[0].type) {
        case "address":
          _value = String(res);
          break;
        case "uint":
        case "uint256":
          _value = Number(res).toString();
          break;
        case "bool":
          _value = Boolean(res).toString();
          break;
        case "string":
        case "bytes":
        default:
          _value = String(res);
          break;
      }
      setValue(_value);
    } catch (e: any) {
      console.error(e);
    } finally {
      // setLoading(false);
    }
  };

  const handleTransactOnClick = async () => {
    const parms: string[] = [];
    abiFragment.inputs?.forEach((item) => {
      parms.push(args[item.name!]);
    });

    try {
      writeContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: abiFragment.name,
        args: parms,
        chainId,
      });
    } catch (e: any) {
      console.error(e);
    } finally {
      // setLoading(false);
    }
  };

  const tranactionViewUrl = (hash: string) => {
    switch (`${chain}/${network}`) {
      case "ethereum/mainnet":
        return `https://etherscan.io/tx/${hash}`;
      case "ethereum/sepolia":
        return `https://sepolia.etherscan.io/tx/${hash}`;
      case "arbitrum/one":
        return `https://arbiscan.io/tx/${hash}`;
      case "arbitrum/sepolia":
        return `https://sepolia.arbiscan.io/tx/${hash}`;
      default:
        return "";
    }
  };

  useEffect(() => {
    const temp: { [key: string]: string } = {};
    abiFragment.inputs?.forEach((element) => {
      temp[element.name!] = "";
    });
    setArgs(temp);
  }, [abiFragment.inputs]);

  return (
    <AccordionItem key={`Methods_A_${index}`} value={abiFragment.name + abiFragment.inputs.length}>
      <div style={{ padding: "0" }}>
        <AccordionTrigger>{abiFragment.name}</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <Method abi={abiFragment} setArgs={setArgs} />
            <div className="mb-3">
              {getButtonVariant(abiFragment.stateMutability) === "primary" ? (
                <Button size="sm" onClick={handleCallOnClick}>
                  query
                </Button>
              ) : (
                <Button
                  size="sm"
                  disabled={!isConnected || !isRightNetwork}
                  onClick={handleTransactOnClick}
                >
                  transact
                </Button>
              )}
              {hash && (
                <div className="mt-2">
                  <a href={tranactionViewUrl(hash)} target="_blank">
                    view transaction
                  </a>
                </div>
              )}
              {value && (
                <div className="mt-4">
                  <Label htmlFor="text">{abiFragment.outputs[0].type}</Label>
                  <Input
                    type="text"
                    className="mt-2"
                    value={value}
                    readOnly
                    size={10}
                    placeholder="result"
                    hidden={
                      !(
                        abiFragment.stateMutability === "view" ||
                        abiFragment.stateMutability === "pure"
                      )
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </AccordionContent>
      </div>
    </AccordionItem>
  );
};

interface MethodProps {
  abi: AbiFunction;
  setArgs: Dispatch<SetStateAction<{ [key: string]: string }>>;
}
const Method = ({ abi, setArgs }: MethodProps) => {
  const [inputs, setInputs] = useState<ReadonlyArray<AbiParameter>>([]);

  useEffect(() => {
    setInputs(abi && abi.inputs ? abi.inputs : []);
  }, [abi]);

  return (
    <div className="Method">
      {inputs.map((item, index) => (
        <div
          key={index.toString()}
          className="grid w-full items-center gap-1.5"
        >
          <Label htmlFor="text">{item.name}</Label>
          <Input
            type="text"
            size={10}
            name={item.name}
            placeholder={item.type}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (event.target.value[0] === "[") {
                setArgs((prev) => ({
                  ...prev,
                  [event.target.name]: JSON.parse(event.target.value),
                }));
              } else {
                setArgs((prev) => ({
                  ...prev,
                  [event.target.name]: event.target.value,
                }));
              }
            }}
          />
        </div>
      ))}
    </div>
  );
};
