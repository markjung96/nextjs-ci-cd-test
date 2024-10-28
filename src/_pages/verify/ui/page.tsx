import { getArbitrumVerificationResult } from "@/src/features/verify/api";
import { VerifyStepper } from "./verify-stepper";
import { CodeExplorer } from "./code-explorer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/shared/ui";
import { ContractInteract } from "./contract-interact";
import { getSolidityVerificationResult } from "@/src/features/verify/api/solidity";
import { getCairoVerificationResult } from "@/src/features/verify/api/cairo";

export type ContractInfo = {
  chain: string;
  network: string;
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
  const chain = searchParams?.chain;
  const network = searchParams?.network;
  const contractAddress = searchParams?.contractAddress;
  const compilerType = searchParams?.compilerType;
  const compilerVersion = searchParams?.compilerVersion;
  let verifiedSrcUrl = null;
  let outFileUrl = null;
  let initialStep = 0;
  let result = null;

  if (contractAddress) {
    if (chain === "ethereum" && network !== undefined) {
      result = await getSolidityVerificationResult(
        "ethereum",
        network.toLowerCase() === "mainnet" ? "0x1" : "0xaa36a7",
        contractAddress
      );
    }
    if (chain === "arbitrum" && network !== undefined) {
      result = await getArbitrumVerificationResult(
        network.toLowerCase() === "one" ? "ARBITRUM_ONE" : "ARBITRUM_SEPOLIA",
        contractAddress
      );
      // 리믹스에 소스코드가 업로드 되었을 때
      if (result?.isRemixSrcUploaded) {
        initialStep = 1;
      }
    }
    if (chain === "starknet" && network !== undefined) {
      result = await getCairoVerificationResult(
        network.toLowerCase() === "mainnet"
          ? "0x534e5f4d41494e"
          : "0x534e5f5345504f4c4941",
        contractAddress
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
    <div className="h-full flex flex-col items-center justify-center p-4">
      <div className="max-w-7xl w-full p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-2">
          Verify & Publish Contract Source Code
        </h1>
        <p className="text-center  mb-6">
          Source code verification provides transparency for users interacting
          with smart contracts.
        </p>
        <div className="flex w-full flex-col justify-center gap-4">
          {verifiedSrcUrl ? (
            <>
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                <p className="block sm:inline">
                  Contract {contractAddress} has been verified
                </p>
                <br />
                <p className="block sm:inline">
                  You can download the verified source code{" "}
                  <a href={verifiedSrcUrl} className="text-blue-600" download>
                    here
                  </a>
                </p>
              </div>
              <Tabs defaultValue="code">
                <TabsList>
                  <TabsTrigger value="code">Code</TabsTrigger>
                  <TabsTrigger value="interact">Interact</TabsTrigger>
                </TabsList>
                <TabsContent value="code">
                  <CodeExplorer url={verifiedSrcUrl} />
                </TabsContent>
                <TabsContent value="interact">
                  {outFileUrl && (
                    <ContractInteract
                      outFileUrl={outFileUrl}
                      contractAddress={contractAddress!}
                    />
                  )}
                </TabsContent>
              </Tabs>
            </>
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
        </div>
      </div>
    </div>
  );
};
