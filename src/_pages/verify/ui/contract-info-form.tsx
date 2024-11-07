import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/ui';
import { useStepper } from '@/src/widgets/Stpper';
import { Dispatch, FC, SetStateAction, useMemo, useState } from 'react';
import { ContractInfo, EthereumContractInfo, isOsType, SupportedChain } from './page';
import solidityVersion from '@/src/shared/const/solidity-version.json';
import NFTModal from './nft-modal';

type ChainInfo = {
  chainName: string;
  networks: string[];
  compilers: string[];
};

const chainInfos: ChainInfo[] = [
  {
    chainName: 'ethereum',
    networks: ['mainnet', 'sepolia'],
    compilers: ['solidity'],
  },
  {
    chainName: 'arbitrum',
    networks: ['one', 'sepolia'],
    compilers: ['solidity', 'stylus'],
  },
  {
    chainName: 'starknet',
    networks: ['mainnet', 'sepolia'],
    compilers: ['cairo'],
  },
];

const solidityCompilerVersions = solidityVersion.builds
  .reverse()
  .filter((build) => !build.longVersion.includes('nightly'))
  .map((build) => `v${build.version}+${build.build}`);
const stylusCompilerVersions = ['0.5.1', '0.5.2', '0.5.3', '0.5.4', '0.5.5'];
const cairoCompilerVersions = [
  '2.3.0',
  '2.3.1',
  '2.4.0',
  '2.4.1',
  '2.4.2',
  '2.4.3',
  '2.4.4',
  '2.5.0',
  '2.5.1',
  '2.5.2',
  '2.5.3',
  '2.5.4',
  '2.6.0',
  '2.6.1',
  '2.6.2',
  '2.6.3',
  '2.6.4',
  '2.6.5',
  '2.7.0',
  '2.7.1',
  '2.8.0',
  '2.8.1',
  '2.8.2',
];

interface ContractInfoProps {
  contractInfo: ContractInfo;
  setContractInfo: Dispatch<SetStateAction<ContractInfo>>;
}

export const ContractInfoForm: FC<ContractInfoProps> = ({ contractInfo, setContractInfo }) => {
  const { nextStep } = useStepper();
  const [selectedChain, setSelectedChain] = useState<ChainInfo>(
    chainInfos.filter((chainInfo) => contractInfo.chain === chainInfo.chainName)[0],
  );

  const compilerVersions = useMemo(() => {
    if (contractInfo.compilerType === 'solidity') {
      return solidityCompilerVersions;
    } else if (contractInfo.compilerType === 'stylus') {
      return stylusCompilerVersions;
    } else if (contractInfo.compilerType === 'cairo') {
      return cairoCompilerVersions;
    }
    return [];
  }, [contractInfo.compilerType]);

  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="contract-address" className="block text-sm font-medium ">
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
      {contractInfo.chain === 'starknet' && (
        <div>
          <Label htmlFor="contract-address" className="block text-sm font-medium ">
            Please enter the Declare Transaction Hash
          </Label>
          <Input
            type="text"
            id="contract-address"
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="0x"
            value={contractInfo.declareTxHash}
            onChange={(e) =>
              setContractInfo((prevValue) => ({
                ...prevValue,
                declareTxHash: e.target.value,
              }))
            }
          />
        </div>
      )}
      <div className="flex row w-full gap-10 padding-4">
        <div className="flex-1">
          <Label htmlFor="compiler-type" className="block text-sm font-medium ">
            Please Select Chain
          </Label>
          <Select
            defaultValue={selectedChain.chainName}
            onValueChange={(item: SupportedChain) => {
              setSelectedChain(chainInfos.filter((chainInfo) => chainInfo.chainName === item)[0]);
              setContractInfo(
                (prevValue) =>
                  ({
                    ...prevValue,
                    chain: item,
                    network: chainInfos.filter((chainInfo) => chainInfo.chainName === item)[0].networks[0],
                  } as ContractInfo),
              );
            }}
          >
            <SelectTrigger className="w-full mt-1 border-x-0 focus-visible:ring-0 focus-visible:ring-offset-0">
              <SelectValue placeholder="Select a Protocol" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {chainInfos.map((item) => (
                  <SelectItem key={item.chainName} value={item.chainName.toLowerCase()}>
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
              setContractInfo(
                (prevValue) =>
                  ({
                    ...prevValue,
                    network: network,
                  } as ContractInfo),
              )
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
              setContractInfo(
                (prevValue) =>
                  ({
                    ...prevValue,
                    compilerType: compiler,
                  } as ContractInfo),
              )
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
          <Label htmlFor="compiler-version" className="block text-sm font-medium ">
            Please Select Compiler Version
          </Label>
          <Select
            defaultValue={contractInfo.chain === 'starknet' ? contractInfo.scarbVersion : contractInfo.compilerVersion}
            onValueChange={(version) =>
              setContractInfo((prevValue) => {
                if (contractInfo.chain === 'starknet') {
                  return {
                    ...prevValue,
                    scarbVersion: version,
                  };
                }
                return {
                  ...prevValue,
                  compilerVersion: version,
                };
              })
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
      {contractInfo.compilerType === 'solidity' && (
        <div>
          <Label htmlFor="building-env" className="block text-sm font-medium ">
            Please Select Optimization Option
          </Label>
          <RadioGroup
            defaultValue="No"
            className="flex row mt-2"
            id="building-env"
            onValueChange={(value) =>
              setContractInfo((prev) => ({
                ...prev,
                optimize: value === 'Yes' ? '1' : '0',
              }))
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Yes" id="r1" />
              <Label htmlFor="r1">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="No" id="r2" />
              <Label htmlFor="r2">No</Label>
            </div>
          </RadioGroup>
        </div>
      )}
      {contractInfo.compilerType === 'stylus' && (
        <div>
          <Label htmlFor="building-env" className="block text-sm font-medium ">
            Please Select Building Environment
          </Label>
          <RadioGroup
            defaultValue="x86"
            className="flex row mt-2"
            id="building-env"
            onValueChange={(value) => {
              if (isOsType(value))
                setContractInfo((prevValue) => ({
                  ...prevValue,
                  os: value,
                }));
            }}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="x86" id="r1" />
              <Label htmlFor="r1">x86</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="arm" id="r2" />
              <Label htmlFor="r2">arm</Label>
            </div>
          </RadioGroup>
        </div>
      )}

      <div>
        <div className="flex items-center gap-1">
          <Label htmlFor="user-account" className="block text-sm font-medium ">
            Enter your Ethereum Account to get NFT
          </Label>
          <NFTModal chain={contractInfo.chain}/>
        </div>
        <Input
          id="user-account"
          type="text"
          className="w-1/2 block mt-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="0x"
          value={'0x'} //contractInfo.userAccount}
          onChange={(e) =>
            setContractInfo((prevValue) => ({
              ...prevValue,
              userAccount: e.target.value,
            }))
          }
        />
      </div>

      <div className="flex items-center">
        <Input
          id="terms"
          type="checkbox"
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          defaultChecked
        />
        <Label htmlFor="terms" className="ml-2 text-sm ">
          I agree to the{' '}
          <a href="#" className="text-blue-600">
            terms of service
          </a>
        </Label>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="reset" className="px-4 py-2 text-sm font-medium  bg-gray-200 rounded-md hover:bg-gray-300">
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
