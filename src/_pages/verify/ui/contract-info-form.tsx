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
import { Dispatch, FC, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import {
  ContractInfo,
  isArbitrumContractInfo,
  isEthereumContractInfo,
  isOsType,
  isStarknetContractInfo,
  SupportedChain,
} from './page';
import solidityVersion from '@/src/shared/const/solidity-version.json';
import NFTModal from './nft-modal';
import { Checkbox } from '@/components/ui/checkbox';
import { isEthAddress, isStarknetAddress } from '@/src/shared/lib/network';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type ChainInfo = {
  chainName: string;
  networks: string[];
  compilers: string[];
};

type ErrorMessage = {
  contractAddress: null | string;
  declareTxHash: null | string;
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
  const inputRef = useRef<HTMLInputElement>(null);
  const { nextStep } = useStepper();
  const [selectedChain, setSelectedChain] = useState<ChainInfo>(
    chainInfos.filter((chainInfo) => contractInfo.chain === chainInfo.chainName)[0],
  );
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>({
    contractAddress: null,
    declareTxHash: null,
  });

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

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form className="space-y-6 mx-1">
      <div className="relative grid grid-cols-1 gap-2">
        <Label htmlFor="contract-address" className="block text-sm font-medium ">
          Please enter the Contract Address you would like to verify
        </Label>
        <Input
          ref={inputRef}
          type="text"
          id="contract-address"
          className={`block w-full mt-1 rounded-md shadow-sm sm:text-sm ${
            errorMessage.contractAddress ? 'ring-red-500' : ''
          }`}
          placeholder="0x"
          value={contractInfo.contractAddress}
          onChange={(e) => {
            setErrorMessage((prev) => ({ ...prev, contractAddress: null }));
            setContractInfo((prevValue) => ({
              ...prevValue,
              contractAddress: e.target.value,
            }));
          }}
        />
        {errorMessage.contractAddress && (
          <p
            className={`absolute top-[78px] text-red-500 text-xs ${
              errorMessage.contractAddress ? 'animate-shake' : ''
            }`}
          >
            {errorMessage.contractAddress}
          </p>
        )}
      </div>
      {contractInfo.chain === 'starknet' && (
        <div className="relative grid grid-cols-1 gap-2">
          <Label htmlFor="contract-address" className="block text-sm font-medium ">
            Please enter the Declare Transaction Hash
          </Label>
          <Input
            type="text"
            id="contract-address"
            className={`block w-full mt-1 rounded-md shadow-sm sm:text-sm ${
              errorMessage.declareTxHash ? 'ring-red-500' : ''
            }`}
            placeholder="0x"
            value={contractInfo.declareTxHash}
            onChange={(e) => {
              setErrorMessage((prev) => ({ ...prev, declareTxHash: null }));
              setContractInfo((prevValue) => ({
                ...prevValue,
                declareTxHash: e.target.value,
              }));
            }}
          />
          {errorMessage.declareTxHash && (
            <p
              className={`absolute top-[78px] text-red-500 text-xs ${
                errorMessage.declareTxHash ? 'animate-shake' : ''
              }`}
            >
              {errorMessage.declareTxHash}
            </p>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="compiler-type" className="block text-sm font-medium ">
            Please Select Chain
          </Label>
          <Select
            defaultValue={selectedChain.chainName}
            onValueChange={(item: SupportedChain) => {
              const targetChainInfo = chainInfos.find((chainInfo) => chainInfo.chainName === item);
              if (!targetChainInfo) return;

              let chainDefault = {};
              switch (item) {
                case 'arbitrum': {
                  chainDefault = {
                    chain: item,
                    network: targetChainInfo.networks[0],
                    compilerType: 'stylus',
                    compilerVersion: '0.5.5',
                    os: 'x86',
                  };
                  break;
                }
                case 'ethereum': {
                  chainDefault = {
                    chain: item,
                    network: targetChainInfo.networks[0],
                    compilerType: 'solidity',
                    compilerVersion: 'v0.8.26+commit.8a97fa7a',
                  };
                  break;
                }
                case 'starknet': {
                  chainDefault = {
                    chain: item,
                    network: targetChainInfo.networks[0],
                    compilerType: 'cairo',
                    scarbVersion: '2.8.2',
                  };
                  break;
                }
              }
              setSelectedChain(targetChainInfo);
              setContractInfo(
                (prevValue) =>
                  ({
                    ...prevValue,
                    ...chainDefault,
                  } as ContractInfo),
              );
            }}
          >
            <SelectTrigger className="w-full mt-1">
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

        <div className="space-y-2">
          <Label htmlFor="compiler-type" className="block text-sm font-medium ">
            Please Select Network
          </Label>
          <Select
            value={contractInfo.network}
            onValueChange={(network) => {
              if (network === '') return;
              setContractInfo(
                (prevValue) =>
                  ({
                    ...prevValue,
                    network: network,
                  } as ContractInfo),
              );
            }}
          >
            <SelectTrigger className="w-full mt-1">
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

        <div className="space-y-2">
          <Label htmlFor="compiler-type" className="block text-sm font-medium ">
            Please Select Compiler Type
          </Label>
          <Select
            value={contractInfo.compilerType}
            onValueChange={(compiler) => {
              if (compiler === '') return;
              setContractInfo(
                (prevValue) =>
                  ({
                    ...prevValue,
                    compilerType: compiler,
                  } as ContractInfo),
              );
            }}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select a Compiler Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {selectedChain.compilers.map((item) => (
                  <SelectItem key={item} value={item.toLowerCase()}>
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="compiler-version" className="block text-sm font-medium ">
            Please Select Compiler Version
          </Label>
          <Select
            value={contractInfo.chain === 'starknet' ? contractInfo.scarbVersion : contractInfo.compilerVersion}
            onValueChange={(version) => {
              if (version === '') return;
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
              });
            }}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select a compiler version" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {compilerVersions.map((item) => (
                  <SelectItem key={item} value={item.toLowerCase()}>
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {contractInfo.compilerType === 'solidity' && (
        <div className="space-y-2">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          {contractInfo.compilerType === 'stylus' && (
            <div className="space-y-2">
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
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="user-account" className="block text-sm font-medium ">
                Enter your Ethereum Account to get NFT
              </Label>
              <NFTModal chain={contractInfo.chain} />
            </div>
            <Input
              id="user-account"
              type="text"
              className="block mt-1 rounded-md shadow-sm sm:text-sm"
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
        </div>
        {contractInfo.chain === 'arbitrum' && (
          <ol className="ml-4 list-disc">
            <li>
              <p className="text-sm">
                Please select the compiler language and version used for the deployed Arbitrum contract.
              </p>
            </li>
            <li>
              <p className="text-sm">In particular, with Stylus, you can choose the OS.</p>
            </li>
            <li>
              <p className="text-sm">
                If the Arbitrum contract was deployed without the{' '}
                <span className="font-semibold bg-indigo-100 dark:bg-indigo-900 px-1 rounded">--no-verify</span> option,
                choose <span className="font-semibold bg-indigo-100 dark:bg-indigo-900 px-1 rounded">x86</span> and
                proceed with verification.
              </p>
            </li>
            <li>
              <TooltipProvider delayDuration={100}>
                <p className="text-sm">
                  If the{' '}
                  <span className="font-semibold bg-indigo-100 dark:bg-indigo-900 px-1 rounded">--no-verify</span>{' '}
                  option was used, select either{' '}
                  <span className="font-semibold bg-indigo-100 dark:bg-indigo-900 px-1 rounded">arm</span> or{' '}
                  <span className="font-semibold bg-indigo-100 dark:bg-indigo-900 px-1 rounded">x86</span> for
                  verification.
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex items-center text-[#A2A3BD] ml-2 text-[0.9em] cursor-pointer">
                        &#9432;
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        Since Docker is a Linux-based container, <br />
                        deploying and verifying through Docker on a Mac <br />
                        tends tobe slow and inefficient. <br />
                        Previously, Arbitrum verifiers were unable to <br />
                        verify contracts deployed natively on Mac. <br />
                        However, with VeriWell, verification is now possible.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </p>
              </TooltipProvider>
            </li>
          </ol>
        )}
      </div>

      <div className="flex items-center">
        <Checkbox
          id="terms"
          checked={contractInfo.agreeTerm}
          onChange={() =>
            setContractInfo((prevValue) => ({
              ...prevValue,
              agreeTerm: !prevValue.agreeTerm,
            }))
          }
        />
        <Label htmlFor="terms" className="ml-2 text-sm ">
          I agree to the{' '}
          <a href="#" className="text-blue-600">
            terms of service
          </a>
        </Label>
      </div>

      <ContinueButton nextStep={nextStep} contractInfo={contractInfo} setErrorMessage={setErrorMessage} />
    </form>
  );
};

type ContinueButtonProps = {
  nextStep: () => void;
  contractInfo: ContractInfo;
  setErrorMessage: Dispatch<SetStateAction<ErrorMessage>>;
};
const ContinueButton = ({ nextStep, contractInfo, setErrorMessage }: ContinueButtonProps) => {
  const checkContinueButtonDisable = (contractInfo: ContractInfo) => {
    const isNotEmpty = (value: string | boolean | undefined | null): value is string =>
      value !== '' && value !== undefined && value !== null;

    for (const [, value] of Object.entries(contractInfo)) {
      if (typeof value === 'object') continue;
      if (!isNotEmpty(value)) return true;
    }

    if (isEthereumContractInfo(contractInfo)) {
      const { optimize } = contractInfo;
      if (optimize === undefined) return true;
    }

    if (isArbitrumContractInfo(contractInfo)) {
      const { compilerType, os } = contractInfo;
      if (compilerType === 'stylus' && os === undefined) return true;
    }

    if (isStarknetContractInfo(contractInfo)) {
      const { declareTxHash } = contractInfo;
      if (declareTxHash === undefined) return true;
    }

    return false;
  };

  const handleContinueButtonOnClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    const isInvalidEthOrStarknetAddress =
      !isEthAddress(contractInfo.contractAddress) && !isStarknetAddress(contractInfo.contractAddress);
    const isInvalidStarknetDeclareTxHash =
      isStarknetContractInfo(contractInfo) && !isStarknetAddress(contractInfo.declareTxHash);

    if (isInvalidEthOrStarknetAddress || isInvalidStarknetDeclareTxHash) {
      if (isInvalidEthOrStarknetAddress) setErrorMessage((prev) => ({ ...prev, contractAddress: 'Invalid Address' }));
      if (isInvalidStarknetDeclareTxHash)
        setErrorMessage((prev) => ({ ...prev, declareTxHash: 'Invalid Transaction Hash' }));

      return;
    }

    nextStep();
  };

  return (
    <div className="flex justify-end space-x-4">
      <Button
        type="submit"
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        disabled={checkContinueButtonDisable(contractInfo)}
        onClick={handleContinueButtonOnClick}
      >
        Continue
      </Button>
    </div>
  );
};
