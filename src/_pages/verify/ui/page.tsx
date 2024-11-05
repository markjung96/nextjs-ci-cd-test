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

export type EthereumContractInfo = {
  chain: 'ethereum';
  network: 'mainnet' | 'sepolia' | 'goerli';
  contractAddress: string;
  compilerType: 'solidity';
  compilerVersion: string;
  sourceFile: File | null;
  optimize: '0' | '1';
  optimizeRuns?: string | '200';
  evmVersion?: string | 'default';
};

export type ArbitrumContractInfo = {
  chain: 'arbitrum';
  network: 'one' | 'sepolia';
  contractAddress: string;
  compilerType: 'stylus';
  compilerVersion: string;
  sourceFile: File | null;
};

export type StarknetContractInfo = {
  chain: 'starknet';
  network: 'mainnet' | 'sepolia';
  contractAddress: string;
  declareTxHash: string;
  scarbVersion: string;
  compilerType: 'cairo';
  compilerVersion: string;
  sourceFile: File | null;
};

export type ContractInfo = EthereumContractInfo | ArbitrumContractInfo | StarknetContractInfo;

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
    <div className="h-full flex flex-col items-center justify-center p-4 w-4/5">
      <div className="max-w-7xl w-full p-6 rounded-lg shadow-md">
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
    </div>
  );
};
