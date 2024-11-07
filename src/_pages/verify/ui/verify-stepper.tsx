'use client';
import { Step, type StepItem, Stepper } from '@/src/widgets/Stpper';
import { ContractInfoForm } from './contract-info-form';
import { ContractVerifyForm } from './contract-verify-form';
import { ResultVerify } from './result-verify';
import { FC, useState } from 'react';
import {
  ArbitrumContractInfo,
  ContractInfo,
  EthereumContractInfo,
  StarknetContractInfo,
  SupportedChain,
  SupportedCompilerType,
} from './page';
import {
  EvmVerificationResultDto,
  StylusVerificationCheckResultDto,
  CairoVerificationResultDto,
} from '@/src/features/verify/api';

const steps = [{ label: 'Enter Contract Details' }, { label: 'Verify & Publish' }] satisfies StepItem[];

interface VerifyStepperProps {
  initialStep: number;
  chain?: SupportedChain;
  network?: string;
  contractAddress?: string;
  compilerType?: SupportedCompilerType;
  compilerVersion?: string;
  checkResult?: EvmVerificationResultDto | StylusVerificationCheckResultDto | CairoVerificationResultDto;
}

export const VerifyStepper: FC<VerifyStepperProps> = ({
  initialStep,
  chain,
  network,
  contractAddress,
  compilerType,
  compilerVersion,
  checkResult,
}) => {
  // 사용자가 verify 페이지에 직접 접근했을 때, 초기값 설정
  let _contractInfo: ContractInfo = {
    chain: 'ethereum',
    network: 'mainnet',
    contractAddress: '',
    compilerType: 'solidity',
    compilerVersion: 'v0.8.26+commit.8a97fa7a',
    sourceFile: null,
    optimize: '0',
    agreeTerm: true,
  };
  switch (chain) {
    case undefined:
    case 'ethereum':
      _contractInfo = {
        ..._contractInfo,
        chain: chain || 'ethereum',
        network: (network as EthereumContractInfo['network']) || 'mainnet',
        contractAddress: contractAddress || '',
        compilerType: (compilerType as EthereumContractInfo['compilerType']) || 'solidity',
        compilerVersion: compilerVersion || 'v0.8.26+commit.8a97fa7a',
      };
      break;
    case 'arbitrum':
      _contractInfo = {
        ..._contractInfo,
        chain,
        network: (network as ArbitrumContractInfo['network']) || 'mainnet',
        contractAddress: contractAddress || '',
        compilerType: (compilerType as ArbitrumContractInfo['compilerType']) || 'stylus',
        compilerVersion: compilerVersion || '0.5.5',
        os: 'x86',
      };

      break;
    case 'starknet':
      _contractInfo = {
        ..._contractInfo,
        chain,
        network: (network as StarknetContractInfo['network']) || 'mainnet',
        contractAddress: contractAddress || '',
        declareTxHash: '',
        compilerType: (compilerType as StarknetContractInfo['compilerType']) || 'cairo',
        compilerVersion: compilerVersion || '2.8.2',
        scarbVersion: compilerVersion || '2.8.2',
      };
      break;

    default:
      break;
  }

  const [contractInfo, setContractInfo] = useState<ContractInfo>(_contractInfo);
  const [loading, setLoading] = useState(false);

  return (
    <Stepper initialStep={initialStep} steps={steps} state={loading ? 'loading' : undefined} scrollTracking>
      {steps.map((stepProps, index) => {
        return (
          <Step key={stepProps.label} {...stepProps}>
            {index === 0 && <ContractInfoForm contractInfo={contractInfo} setContractInfo={setContractInfo} />}
            {index === 1 && (
              <ContractVerifyForm
                contractInfo={contractInfo}
                setContractInfo={setContractInfo}
                isRemixSrcUploaded={
                  chain === 'arbitrum' ? (checkResult as StylusVerificationCheckResultDto).isRemixSrcUploaded : false
                }
              />
            )}
          </Step>
        );
      })}
      <ResultVerify
        contractInfo={contractInfo}
        isRemixSrcUploaded={
          chain === 'arbitrum' ? (checkResult as StylusVerificationCheckResultDto).isRemixSrcUploaded : false
        }
      />
    </Stepper>
  );
};
