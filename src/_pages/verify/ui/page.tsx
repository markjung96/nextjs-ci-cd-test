"use client";
import { Step, type StepItem, Stepper, useStepper } from "@/src/widgets/Stpper";
import { ContractInfoForm } from "./contract-info-form";
import { useState } from "react";
import { ContractVerifyForm } from "./contract-verify-form";
import { useSearchParams } from "next/navigation";

const steps = [
  { label: "Enter Contract Details" },
  { label: "Verify & Publish" },
] satisfies StepItem[];

export type ContractInfo = {
  contractAddress: string;
  compilerType: string;
  compilerVersion: string;
};

export const VerifiyPage = () => {
  const searchParams = useSearchParams();
  const contractAddress = searchParams.get("contractAddress");
  const compilerType = searchParams.get("compilerType");
  const compilerVersion = searchParams.get("compilerVersion");
  const [loading, setLoading] = useState(false);
  const [contractInfo, setContractInfo] = useState<ContractInfo>({
    contractAddress:
      contractAddress || "0x7395b3f7b3510887665beb894ee63de1d79993e3",
    compilerType: compilerType || "stylus",
    compilerVersion: compilerVersion || "0.5.2",
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-2xl w-full p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-2">
          Verify & Publish Contract Source Code
        </h1>
        <p className="text-center  mb-6">
          Source code verification provides transparency for users interacting
          with smart contracts. By uploading the source code, Arbitrum Sepolia
          will match the compiled code with that on the blockchain.{" "}
          <a href="#" className="text-blue-600">
            Read more.
          </a>
        </p>
        <div className="flex w-full flex-col justify-center gap-4">
          <Stepper
            initialStep={0}
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
                    />
                  )}
                </Step>
              );
            })}
          </Stepper>
        </div>
      </div>
    </div>
  );
};
