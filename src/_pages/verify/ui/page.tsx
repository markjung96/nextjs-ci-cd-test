import { getVerificationResult } from "@/src/features/verify/api";
import { ArbitrumStepper } from "./arbitrum-stepper";

export type ContractInfo = {
  contractAddress: string;
  compilerType: string;
  compilerVersion: string;
  sourceFile: File | null;
};

export const VerifiyPage = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) => {
  const contractAddress = searchParams?.contractAddress;
  const compilerType = searchParams?.compilerType;
  const compilerVersion = searchParams?.compilerVersion;
  let verifiedSrcUrl = null;
  let initialStep = 0;
  let result = null;

  if (contractAddress) {
    // FIXME: network should be dynamic
    result = await getVerificationResult("ARBITRUM_SEPOLIA", contractAddress);
    console.log("result", result);

    // 검증이 완룓되었을 때
    if (result.verifiedSrcUrl) {
      verifiedSrcUrl = result.verifiedSrcUrl;
    }

    // 리믹스에 소스코드가 업로드 되었을 때
    if (result.isRemixSrcUploaded) {
      initialStep = 1;
    }
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
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
          {verifiedSrcUrl ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              <p className="block sm:inline">
                Contract {contractAddress} has been verified
              </p>
              <br />
              <p className="block sm:inline">
                You can download the verified source code{" "}
                {verifiedSrcUrl && (
                  <a href={verifiedSrcUrl} className="text-blue-600" download>
                    here
                  </a>
                )}
              </p>
            </div>
          ) : (
            <ArbitrumStepper
              initialStep={initialStep}
              contractAddress={contractAddress}
              compilerType={compilerType}
              compilerVersion={compilerVersion}
              checkResult={result || undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
};
