import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/ui";
import { useStepper } from "@/src/widgets/Stpper";
import { Dispatch, FC, SetStateAction, useMemo, useState } from "react";
import { ContractInfo } from "./page";
import solidityVersion from "@/src/shared/lib/solidity-version.json";

type ChainInfo = {
  chainName: string;
  networks: string[];
  compilers: string[];
};

const chainInfos: ChainInfo[] = [
  {
    chainName: "ethereum",
    networks: ["mainnet", "sepolia"],
    compilers: ["solidity"],
  },
  {
    chainName: "arbitrum",
    networks: ["one", "sepolia"],
    compilers: ["solidity", "stylus"],
  },
  {
    chainName: "starknet",
    networks: ["mainnet", "sepolia"],
    compilers: ["cairo"],
  },
];

const solidityCompilerVersions = solidityVersion.builds
  .reverse()
  .filter((build) => !build.longVersion.includes("nightly"))
  .map((build) => `v${build.version}+${build.build}`);
const stylusCompilerVersions = ["0.5.1", "0.5.3"];
const cairoCompilerVersions = ["0.0.1"];

interface ContractInfoProps {
  contractInfo: ContractInfo;
  setContractInfo: Dispatch<SetStateAction<ContractInfo>>;
}

export const ContractInfoForm: FC<ContractInfoProps> = ({
  contractInfo,
  setContractInfo,
}) => {
  const { nextStep } = useStepper();
  const [selectedChain, setSelectedChain] = useState<ChainInfo>(
    chainInfos.filter(
      (chainInfo) => contractInfo.chain === chainInfo.chainName
    )[0]
  );

  const compilerVersions = useMemo(() => {
    if (contractInfo.compilerType === "solidity") {
      return solidityCompilerVersions;
    } else if (contractInfo.compilerType === "stylus") {
      return stylusCompilerVersions;
    } else if (contractInfo.compilerType === "cairo") {
      return cairoCompilerVersions;
    }
    return [];
  }, [contractInfo.compilerType]);

  return (
    <form className="space-y-4">
      <div>
        <Label
          htmlFor="contract-address"
          className="block text-sm font-medium "
        >
          Please enter the Contract Address you would like to verify
        </Label>
        <Input
          type="text"
          id="contract-address"
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="0x"
          value={contractInfo.contractAddress}
          onChange={(e) =>
            setContractInfo((prevValue) => ({
              ...prevValue,
              contractAddress: e.target.value,
            }))
          }
        />
      </div>
      <div className="flex row w-full gap-10 padding-4">
        <div className="flex-1">
          <Label htmlFor="compiler-type" className="block text-sm font-medium ">
            Please Select Chain
          </Label>
          <Select
            defaultValue={selectedChain.chainName}
            onValueChange={(item) => {
              setSelectedChain(
                chainInfos.filter(
                  (chainInfo) => chainInfo.chainName === item
                )[0]
              );
              setContractInfo((prevValue) => ({
                ...prevValue,
                chain: item,
                network: chainInfos.filter(
                  (chainInfo) => chainInfo.chainName === item
                )[0].networks[0],
              }));
            }}
          >
            <SelectTrigger className="w-full mt-1 border-x-0 focus-visible:ring-0 focus-visible:ring-offset-0">
              <SelectValue placeholder="Select a Protocol" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {chainInfos.map((item) => (
                  <SelectItem
                    key={item.chainName}
                    value={item.chainName.toLowerCase()}
                  >
                    {item.chainName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Label htmlFor="compiler-type" className="block text-sm font-medium ">
            Please Select Network
          </Label>
          <Select
            value={contractInfo.network}
            onValueChange={(network) =>
              setContractInfo((prevValue) => ({
                ...prevValue,
                network,
              }))
            }
          >
            <SelectTrigger className="w-full mt-1 border-x-0 focus-visible:ring-0 focus-visible:ring-offset-0">
              <SelectValue placeholder="Select a Protocol" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {selectedChain.networks.map((item) => (
                  <SelectItem key={item} value={item.toLowerCase()}>
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex row w-full gap-10">
        <div className="flex-1">
          <Label htmlFor="compiler-type" className="block text-sm font-medium ">
            Please Select Compiler Type
          </Label>
          <Select
            value={contractInfo.compilerType}
            onValueChange={(compiler) =>
              setContractInfo((prevValue) => ({
                ...prevValue,
                compilerType: compiler,
              }))
            }
          >
            <SelectTrigger className="w-full mt-1 border-x-0 focus-visible:ring-0 focus-visible:ring-offset-0">
              <SelectValue placeholder="Select a Protocol" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {selectedChain.compilers.map((item) => (
                  <SelectItem
                    key={item}
                    value={item.toLowerCase()}
                    // onClick={() =>
                    //   setValue((prevValue) => ({
                    //     ...prevValue,
                    //     protocol: item.toLowerCase(),
                    //   }))
                    // }
                    // onKeyDown={() =>
                    //   setValue((prevValue) => ({
                    //     ...prevValue,
                    //     protocol: item.toLowerCase(),
                    //   }))
                    // }
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Label
            htmlFor="compiler-version"
            className="block text-sm font-medium "
          >
            Please Select Compiler Version
          </Label>
          <Select
            defaultValue={contractInfo.compilerVersion}
            onValueChange={(version) =>
              setContractInfo((prevValue) => ({
                ...prevValue,
                compilerVersion: version,
              }))
            }
          >
            <SelectTrigger className="w-full mt-1 border-x-0 focus-visible:ring-0 focus-visible:ring-offset-0">
              <SelectValue placeholder="Select a compiler version" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {compilerVersions.map((item) => (
                  <SelectItem
                    key={item}
                    value={item.toLowerCase()}
                    // onClick={() =>
                    //   setValue((prevValue) => ({
                    //     ...prevValue,
                    //     protocol: item.toLowerCase(),
                    //   }))
                    // }
                    // onKeyDown={() =>
                    //   setValue((prevValue) => ({
                    //     ...prevValue,
                    //     protocol: item.toLowerCase(),
                    //   }))
                    // }
                  >
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* <div className="flex items-center">
            <Input
              id="nightly-commits"
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <Label
              htmlFor="nightly-commits"
              className="ml-2 text-sm "
            >
              Uncheck to show all nightly commits
            </Label>
          </div> */}
      {/* <div>
            <Label
              htmlFor="license-type"
              className="block text-sm font-medium "
            >
              Please Select Open Source License Type{" "}
              <InfoIcon className="inline-block w-4 h-4 text-gray-400" />
            </Label>
            <Select
              id="license-type"
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option>[Please Select]</option>
            </Select>
          </div> */}
      {contractInfo.compilerType === "stylus" && (
        <div>
          <Label htmlFor="building-env" className="block text-sm font-medium ">
            Please Select Building Environment
          </Label>
          <RadioGroup
            defaultValue="x86"
            className="flex row mt-2"
            id="building-env"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="x86" id="r1" />
              <Label htmlFor="r1">x86</Label>
            </div>
            <div className="flex items-center space-x-2">
              {/* TODO: arm 계열의 verify 준비되면 비활성화 풀기 */}
              <RadioGroupItem disabled value="arm" id="r2" />
              <Label htmlFor="r2" className="text-gray-400">
                arm
              </Label>
            </div>
          </RadioGroup>
        </div>
      )}

      <div className="flex items-center">
        <Input
          id="terms"
          type="checkbox"
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          defaultChecked
        />
        <Label htmlFor="terms" className="ml-2 text-sm ">
          I agree to the{" "}
          <a href="#" className="text-blue-600">
            terms of service
          </a>
        </Label>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="reset"
          className="px-4 py-2 text-sm font-medium  bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Reset
        </Button>
        <Button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          onClick={() => nextStep()}
        >
          Continue
        </Button>
      </div>
    </form>
  );
};
