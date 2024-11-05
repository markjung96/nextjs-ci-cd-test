"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { useEffect } from "react";
import * as React from "react";
import { Button, Input, Label } from "@/src/shared/ui";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { Abi, AbiFunction, AbiParameter } from "viem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Contract } from "starknet"; // v6.10.0 min
import { StarknetProvider, useStarknetProvider } from "./starknet-provider";
import { FileStructure } from "./code-explorer";
import { extractFunctionsFromFiles, FunctionMap } from "./contract-interact";
import FunctionExplainModal from "./function-explain-modal";
import { fetchZip } from "@/src/shared/lib/utils";

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
  fileStructure?: FileStructure[];
}

export const ContractInteractStarknet: FC<ContractInteractProps> = ({
  chain,
  network,
  outFileUrl,
  contractAddress,
  fileStructure,
}) => {
  const [abi, setAbi] = useState<Abi[]>([]);
  const [readAbiFragments, setReadAbiFragments] = useState<AbiFunction[]>([]);
  const [writeAbiFragments, setWriteAbiFragments] = useState<AbiFunction[]>([]);

  const functionMap = extractFunctionsFromFiles(
    chain as "starknet",
    fileStructure
  );

  const getAbi = async (url: string) => {
    const files = await fetchZip(url);
    // const abiFile = files.find((file) => file.name === "output/abi.json");
    const abiFile = files.find((file) => file.name.includes("abi.json"));
    if (abiFile) {
      const totalAbi = JSON.parse(abiFile.content)
        .filter((abiItem: any) => abiItem.type === "interface")[0]
        .items.map((item: any) => ({
          ...item,
          stateMutability: item.state_mutability,
        }));
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
    getAbi(outFileUrl);
  }, []);

  return (
    <StarknetProvider>
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
                      functionMap={functionMap}
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
                      functionMap={functionMap}
                    />
                  );

                return null;
              })}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </StarknetProvider>
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
  const { connectWallet, walletAccount } = useStarknetProvider();
  const handleClickConnect = async () => {
    await connectWallet(network === "mainnet" ? "mainnet" : "sepolia");
  };
  const address = React.useMemo(async () => {
    if (!walletAccount) {
      return "";
    }
    // sleep 0.1s
    await new Promise((resolve) => setTimeout(resolve, 100));
    return walletAccount.address;
  }, [walletAccount]);
  return (
    <>
      {!!walletAccount ? (
        <div className="text-green-500">Connected to {address}</div>
      ) : (
        <Button size="sm" onClick={handleClickConnect}>
          Connect
        </Button>
      )}
    </>
  );
};

interface AccordionCardProps {
  chain: string;
  network: string;
  abi: Abi[];
  abiFragment: AbiFunction;
  index: number;
  contractAddress: string;
  functionMap?: FunctionMap | null;
}
const AccordionCard = ({
  chain,
  network,
  abi,
  abiFragment,
  index,
  contractAddress,
  functionMap,
}: AccordionCardProps) => {
  const { provider, walletAccount } = useStarknetProvider();
  const [hash, setHash] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [args, setArgs] = useState<{ [key: string]: string }>({});
  const isRightNetwork = true;

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
    const { abi: realAbi } = await provider.getClassAt(contractAddress);
    if (realAbi === undefined) {
      throw new Error("no abi.");
    }
    const contract = new Contract(realAbi, contractAddress, provider);

    const parms: string[] = [];
    abiFragment.inputs?.forEach((item) => {
      parms.push(args[item.name!]);
    });

    try {
      const result = await contract[abiFragment.name](...parms);
      let _value = "";
      if (abiFragment.outputs[0].type.includes("integer")) {
        _value = result.toString();
      }
      setValue(_value);
      // read contract
    } catch (e: any) {
      console.error(e);
    } finally {
      // setLoading(false);
    }
  };

  const handleTransactOnClick = async () => {
    if (walletAccount === null) {
      throw new Error("walletAccount is null.");
    }
    const parms: string[] = [];
    abiFragment.inputs?.forEach((item) => {
      parms.push(args[item.name!]);
    });
    const { abi: realAbi } = await provider.getClassAt(contractAddress);
    if (realAbi === undefined) {
      throw new Error("no abi.");
    }

    try {
      const contract = new Contract(realAbi, contractAddress, provider);
      contract.connect(walletAccount);

      const resp = await contract[abiFragment.name](...parms);
      setHash(resp.transaction_hash);
      // const resp = await myWalletAccount.execute(interact);
      // write contract
    } catch (e: any) {
      console.error(e);
    } finally {
      // setLoading(false);
    }
  };

  const tranactionViewUrl = (hash: string) => {
    return network === "mainnet"
      ? `https://starkscan.co/tx/${hash}`
      : `https://sepolia.starkscan.co/tx/${hash}`;
  };

  useEffect(() => {
    const temp: { [key: string]: string } = {};
    abiFragment.inputs?.forEach((element) => {
      temp[element.name!] = "";
    });
    setArgs(temp);
  }, [abiFragment.inputs]);

  return (
    <AccordionItem
      key={`Methods_A_${index}`}
      value={abiFragment.name + abiFragment.inputs.length}
    >
      <div style={{ padding: "0" }}>
        <AccordionTrigger>{abiFragment.name}</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <Method abi={abiFragment} setArgs={setArgs} />
            <div className="mb-3">
              {getButtonVariant(abiFragment.stateMutability) === "primary" ? (
                <div className="flex gap-1">
                  <Button size="sm" onClick={handleCallOnClick}>
                    query
                  </Button>
                  <FunctionExplainModal
                    code={functionMap?.[abiFragment.name]}
                  />
                </div>
              ) : (
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    disabled={!walletAccount || !isRightNetwork}
                    onClick={handleTransactOnClick}
                  >
                    transact
                  </Button>
                  <FunctionExplainModal
                    code={functionMap?.[abiFragment.name]}
                  />
                </div>
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
