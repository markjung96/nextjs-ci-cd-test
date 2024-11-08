import {
  getSolidityVerificationResult,
  getStylusVerificationResult,
  getCairoVerificationResult,
} from '@/src/features/verify/api';
import { VerifyStepper } from './verify-stepper';
import { VerifiedInfo } from './verified-info';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export type SupportedChain = 'ethereum' | 'arbitrum' | 'starknet';
export type SupportedNetwork = 'mainnet' | 'sepolia' | 'goerli' | 'one';
export type SupportedCompilerType = 'solidity' | 'stylus' | 'cairo';

type BaseContractType = {
  chain: SupportedChain;
  network: SupportedNetwork;
  contractAddress: string;
  compilerType: SupportedCompilerType;
  compilerVersion: string;
  sourceFile: File | null;
  agreeTerm: boolean;
};

export type EthereumContractInfo = BaseContractType & {
  chain: Extract<SupportedChain, 'ethereum'>;
  network: Exclude<SupportedNetwork, 'one'>;
  compilerType: Extract<SupportedCompilerType, 'solidity'>;
  optimize: '0' | '1';
  optimizeRuns?: string | '200';
  evmVersion?: string | 'default';
};
export const isEthereumContractInfo = (value: any): value is EthereumContractInfo =>
  (value as EthereumContractInfo)?.chain === 'ethereum';

export type ArbitrumContractInfo = BaseContractType & {
  chain: Extract<SupportedChain, 'arbitrum'>;
  network: Exclude<SupportedNetwork, 'mainnet' | 'goerli'>;
  compilerType: Extract<SupportedCompilerType, 'stylus'>;
  os: 'x86' | 'arm';
};
export const isArbitrumContractInfo = (value: any): value is ArbitrumContractInfo =>
  (value as ArbitrumContractInfo)?.chain === 'arbitrum';

export type StarknetContractInfo = BaseContractType & {
  chain: Extract<SupportedChain, 'starknet'>;
  network: Exclude<SupportedNetwork, 'goerli' | 'one'>;
  compilerType: Extract<SupportedCompilerType, 'cairo'>;
  declareTxHash: string;
  scarbVersion: string;
};
export const isStarknetContractInfo = (value: any): value is StarknetContractInfo =>
  (value as StarknetContractInfo)?.chain === 'starknet';

export type ContractInfo = EthereumContractInfo | ArbitrumContractInfo | StarknetContractInfo;

type OsType = 'x86' | 'arm';
export const isOsType = (value: string): value is OsType => value === 'x86' || value === 'arm';

export const VerifiyPage = async ({ searchParams }: { searchParams?: { [key: string]: string | undefined } }) => {
  const chain = searchParams?.chain as SupportedChain;
  const network = searchParams?.network;
  const contractAddress = searchParams?.contractAddress;
  const compilerType = searchParams?.compilerType as SupportedCompilerType;
  const compilerVersion = searchParams?.compilerVersion;
  let verifiedSrcUrl = null;
  let outFileUrl = null;
  let initialStep = 0;
  let result = null;

  if (contractAddress) {
    if (chain === 'ethereum' && network !== undefined) {
      result = await getSolidityVerificationResult(
        'ethereum',
        network.toLowerCase() === 'mainnet' ? '0x1' : '0xaa36a7',
        contractAddress,
      );
    }
    if (chain === 'arbitrum' && network !== undefined) {
      result = await getStylusVerificationResult(
        network.toLowerCase() === 'one' ? 'ARBITRUM_ONE' : 'ARBITRUM_SEPOLIA',
        contractAddress,
      );
      // 리믹스에 소스코드가 업로드 되었을 때
      if (result?.isRemixSrcUploaded) {
        initialStep = 1;
      }
    }
    if (chain === 'starknet' && network !== undefined) {
      result = await getCairoVerificationResult(
        network.toLowerCase() === 'mainnet' ? '0x534e5f4d41494e' : '0x534e5f5345504f4c4941',
        contractAddress,
      );
    }

    // 검증이 완룓되었을 때
    if (result?.verifiedSrcUrl) {
      verifiedSrcUrl = result.verifiedSrcUrl;
    }
    if (result?.outFileUrl) {
      outFileUrl = result.outFileUrl;
    }
  }

  return (
    <div className="max-w-4xl w-full p-6 rounded-lg border-black dark:border-white border-[3px]">
      <h1 className="text-2xl font-bold text-center mb-2">Verify & Publish Contract Source Code</h1>
      <p className="text-center  mb-6">
        Source code verification provides transparency for users interacting with smart contracts.
      </p>
      <div className="flex w-full flex-col justify-center gap-4">
        <Suspense
          fallback={
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          }
        >
          {verifiedSrcUrl ? (
            <VerifiedInfo
              chain={chain}
              network={network!}
              contractAddress={contractAddress!}
              verifiedSrcUrl={verifiedSrcUrl}
              outFileUrl={outFileUrl ? outFileUrl : undefined}
            />
          ) : (
            <VerifyStepper
              initialStep={initialStep}
              chain={chain}
              network={network}
              contractAddress={contractAddress}
              compilerType={compilerType}
              compilerVersion={compilerVersion}
              checkResult={result || undefined}
            />
          )}
        </Suspense>
      </div>
    </div>
  );
};
