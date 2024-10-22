"use client";
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
import {
  http,
  createConfig,
  WagmiProvider,
  useConnect,
  useAccount,
  useWriteContract,
} from "wagmi";
import { arbitrum, arbitrumSepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { readContract } from "@wagmi/core";
import { Abi, AbiFunction, AbiParameter } from "viem";

export const config = createConfig({
  chains: [arbitrum, arbitrumSepolia],
  multiInjectedProviderDiscovery: false,
  transports: {
    [arbitrum.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
  connectors: [metaMask()],
  ssr: true,
});
const queryClient = new QueryClient();

type File = {
  name: string;
  content: string;
};

const isFunctionFragment = (abi: AbiFunction | Abi): abi is AbiFunction =>
  (abi as AbiFunction).type === "function";

interface ContractInteractProps {
  outFileUrl: string;
  contractAddress: string;
}

export const ContractInteract: FC<ContractInteractProps> = ({
  outFileUrl,
  contractAddress,
}) => {
  const [abi, setAbi] = useState<Abi[]>([]);
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

  const fetchZip = async (url: string) => {
    const zipFile = await fetch(url);
    const arrayBuffer = await zipFile.arrayBuffer();
    const zipBlob = new Blob([arrayBuffer], { type: "application/zip" });
    const zip = new JSZip();
    const unzippedFiles = await zip.loadAsync(zipBlob);
    const files: File[] = await processFiles(unzippedFiles);
    const abiFile = files.find((file) => file.name === "abi.json");
    if (abiFile) {
      setAbi(JSON.parse(abiFile.content));
    }
  };

  useEffect(() => {
    fetchZip(outFileUrl);
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectButton />
        <Accordion type="multiple" className="w-full">
          {abi.map((abiItem, abiIndex) => {
            if (isFunctionFragment(abiItem))
              return (
                <AccordionCard
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
      </QueryClientProvider>
    </WagmiProvider>
  );
};

const ConnectButton = () => {
  const { isConnected, address } = useAccount();
  const { connectors, connect } = useConnect();
  if (isConnected) {
    return <div>connected address : {address}</div>;
  }
  return (
    <div>
      {connectors.map((connector) => (
        <Button
          variant="outline"
          key={connector.uid}
          onClick={() => connect({ connector })}
        >
          {connector.name}
        </Button>
      ))}
    </div>
  );
};

interface AccordionCardProps {
  abi: Abi[];
  abiFragment: AbiFunction;
  index: number;
  contractAddress: string;
}
const AccordionCard = ({
  abi,
  abiFragment,
  index,
  contractAddress,
}: AccordionCardProps) => {
  const { data: hash, writeContract } = useWriteContract();
  const { isConnected } = useAccount();
  const [value, setValue] = useState<string>("");
  const [args, setArgs] = useState<{ [key: string]: string }>({});

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
    // if (!account || !client) return;
    // setLoading(true);

    const parms: string[] = [];
    abiFragment.inputs?.forEach((item) => {
      parms.push(args[item.name!]);
    });

    try {
      const res = await readContract(config, {
        abi,
        address: contractAddress as `0x${string}`,
        functionName: abiFragment.name,
        args: parms,
        chainId: arbitrumSepolia.id,
      });
      console.log("res", Number(res).toString());
      setValue(Number(res).toString());
    } catch (e: any) {
      console.error(e);
    } finally {
      // setLoading(false);
    }
  };

  const handleTransactOnClick = async () => {
    // if (!account || !client || !provider) return;
    // setLoading(true);
    // setResult({});

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
      });
    } catch (e: any) {
      console.error(e);
    } finally {
      // setLoading(false);
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
    <AccordionItem key={`Methods_A_${index}`} value={abiFragment.name}>
      <div style={{ padding: "0" }}>
        <AccordionTrigger>{abiFragment.name}</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <Method abi={abiFragment} setArgs={setArgs} />
            <div className="mb-3">
              {getButtonVariant(abiFragment.stateMutability) === "primary" ? (
                <Button variant="outline" size="sm" onClick={handleCallOnClick}>
                  call
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!isConnected}
                  onClick={handleTransactOnClick}
                >
                  transact
                </Button>
              )}
              {hash && (
                <div className="mt-2">
                  <a
                    href={`https://sepolia.arbiscan.io/tx/${hash}`}
                    target="_blank"
                  >
                    view transaction
                  </a>
                </div>
              )}
              {value && (
                <Input
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
