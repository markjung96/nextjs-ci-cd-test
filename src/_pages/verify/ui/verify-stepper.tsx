"use client";
import { Step, type StepItem, Stepper } from "@/src/widgets/Stpper";
import { ContractInfoForm } from "./contract-info-form";
import { ContractVerifyForm } from "./contract-verify-form";
import { ResultVerify } from "./result-verify";
import { FC, useState } from "react";
import { ContractInfo } from "./page";
import { ArbitrumVerificationCheckResultDto } from "@/src/features/verify/api";

const steps = [
  { label: "Enter Contract Details" },
  { label: "Verify & Publish" },
] satisfies StepItem[];

interface VerifyStepperProps {
  initialStep: number;
  chain?: string;
  network?: string;
  contractAddress?: string;
  compilerType?: string;
  compilerVersion?: string;
  checkResult?: ArbitrumVerificationCheckResultDto;
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
    chain: chain || "ethereum",
    network: network || "mainnet",
    contractAddress: contractAddress || "",
    compilerType: compilerType || "solidity",
    compilerVersion: compilerVersion || "0.8.25",
    sourceFile: null,
  };
  // arbitrum chain
  if (chain === "arbitrum" && checkResult) {
    // remix로 소스코드 업로드한 경우,
    _contractInfo = checkResult?.isRemixSrcUploaded
      ? {
          chain: chain || "ethereum",
          network: network || "mainnet",
          contractAddress: checkResult.contractAddress!,
          compilerType: "stylus",
          compilerVersion: checkResult.deployedCliVersion || "0.5.2",
          sourceFile: null,
        }
      : {
          chain: chain || "ethereum",
          network: network || "mainnet",
          contractAddress: contractAddress || "",
          compilerType: compilerType || "stylus",
          compilerVersion: compilerVersion || "0.5.2",
          sourceFile: null,
        };
  }
  const [contractInfo, setContractInfo] = useState<ContractInfo>(_contractInfo);
  const [loading, setLoading] = useState(false);
  return (
    <Stepper
      initialStep={initialStep}
      steps={steps}
      state={loading ? "loading" : undefined}
      scrollTracking
    >
      {steps.map((stepProps, index) => {
        return (
          <Step key={stepProps.label} {...stepProps}>
            {index === 0 && (
              <ContractInfoForm
                contractInfo={contractInfo}
                setContractInfo={setContractInfo}
              />
            )}
            {index === 1 && (
              <ContractVerifyForm
                contractInfo={contractInfo}
                setContractInfo={setContractInfo}
                isRemixSrcUploaded={checkResult?.isRemixSrcUploaded}
              />
            )}
          </Step>
        );
      })}
      <ResultVerify
        contractInfo={contractInfo}
        isRemixSrcUploaded={checkResult?.isRemixSrcUploaded}
      />
    </Stepper>
  );
};
