import { cn } from "@/src/shared/lib/utils";
import { useStepper } from "@/src/widgets/Stpper";
import { Loader2, CircleCheck, Circle, CircleX } from "lucide-react";
import { ContractInfo } from "./page";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  postStylusSourceCode,
  verifyStylus,
  postSoliditySourceCode,
  verifySolidity,
  postCairoSourceCode,
  verifyCairo,
} from "@/src/features/verify/api";

interface ResultVerifyProps {
  contractInfo: ContractInfo;
  isRemixSrcUploaded?: boolean;
}

type Status = "not_started" | "loading" | "done" | "error";

export const ResultVerify: FC<ResultVerifyProps> = ({
  contractInfo,
  isRemixSrcUploaded,
}) => {
  const { hasCompletedAllSteps } = useStepper();
  const [uploadStatus, setUploadStatus] = useState<Status>("not_started");
  const [verifyStatus, setVerifyStatus] = useState<Status>("not_started");
  const [verifyErrorMsg, setVerifyErrorMsg] = useState<string | null>(null);

  const uploadStatusIcon = useMemo(() => {
    switch (uploadStatus) {
      case "not_started":
        return <Circle />;
      case "loading":
        return <Loader2 className={cn("animate-spin")} />;
      case "done":
        return <CircleCheck color="green" />;
      case "error":
        return <CircleX color="red" />;
    }
  }, [uploadStatus]);

  const verifyStatusIcon = useMemo(() => {
    switch (verifyStatus) {
      case "not_started":
        return <Circle />;
      case "loading":
        return <Loader2 className={cn("animate-spin")} />;
      case "done":
        return <CircleCheck color="green" />;
      case "error":
        return <CircleX color="red" />;
    }
  }, [verifyStatus]);

  const uploadSourceFiles = useCallback(async () => {
    setUploadStatus("loading");
    try {
      // TODO: 다른 chain 지원
      if (contractInfo.chain === "ethereum") {
        const result = await postSoliditySourceCode({
          protocol: contractInfo.chain.toLowerCase() as "ethereum" | "arbitrum",
          chainId:
            contractInfo.network.toLowerCase() === "mainnet"
              ? "0x1"
              : "0xaa36a7",
          contractAddress: contractInfo.contractAddress,
          srcZipFile: contractInfo.sourceFile!,
        });
        setUploadStatus("done");
        return result;
      } else if (contractInfo.chain === "arbitrum") {
        const result = await postStylusSourceCode({
          network:
            contractInfo.network === "one"
              ? "ARBITRUM_ONE"
              : "ARBITRUM_SEPOLIA",
          contractAddress: contractInfo.contractAddress,
          srcZipFile: contractInfo.sourceFile!,
          compilerVersion: contractInfo.compilerVersion,
        });
        setUploadStatus("done");
        return result;
      } else if (contractInfo.chain === "starknet") {
        const result = await postCairoSourceCode({
          chainId:
            contractInfo.network === "mainnet"
              ? "0x534e5f4d41494e"
              : "0x534e5f5345504f4c4941",
          contractAddress: contractInfo.contractAddress,
          srcZipFile: contractInfo.sourceFile!,
        });
        setUploadStatus("done");
        return result;
      } else {
        throw new Error("Unsupported chain");
      }
    } catch (error) {
      setUploadStatus("error");
    }
  }, [contractInfo]);

  const verifyContract = useCallback(
    async (srcFileId?: string) => {
      setVerifyStatus("loading");
      try {
        let result = null;
        // TODO: 다른 chain 지원
        if (contractInfo.chain === "ethereum") {
          result = await verifySolidity({
            optimize: "1",
            optimizeRuns: "200",
            evmVersion: "default",
            compilerVersion: contractInfo.compilerVersion,
            contractAddress: contractInfo.contractAddress,
            protocol: "ethereum",
            chainId:
              contractInfo.network.toLowerCase() === "mainnet"
                ? "0x1"
                : "0xaa36a7",
          });
        } else if (contractInfo.chain === "arbitrum") {
          result = await verifyStylus({
            network:
              contractInfo.network === "one"
                ? "ARBITRUM_ONE"
                : "ARBITRUM_SEPOLIA",
            contractAddress: contractInfo.contractAddress,
            srcFileId,
            cliVersion: contractInfo.compilerVersion,
          });
        } else if (contractInfo.chain === "starknet") {
          result = await verifyCairo({
            chainId:
              contractInfo.network === "mainnet"
                ? "0x534e5f4d41494e"
                : "0x534e5f5345504f4c4941",
            contractAddress: contractInfo.contractAddress,
            declareTxHash: "",
            scarbVersion: "",
            srcFileId: srcFileId!,
          });
        } else {
          throw new Error("Unsupported chain");
        }
        setVerifyStatus("done");
        if (result && result.verifiedSrcUrl) {
          return result;
        } else {
          setVerifyErrorMsg(result.errMsg || "");
          setVerifyStatus("error");
        }
      } catch (error) {
        setVerifyStatus("error");
      }
    },
    [contractInfo]
  );

  useEffect(() => {
    if (hasCompletedAllSteps) {
      (async () => {
        if (isRemixSrcUploaded) {
          await verifyContract();
        } else {
          const result = await uploadSourceFiles();
          if (result && result.srcFileId) {
            await verifyContract(result.srcFileId);
          }
        }
      })();
    }
  }, [
    hasCompletedAllSteps,
    contractInfo,
    uploadSourceFiles,
    verifyContract,
    isRemixSrcUploaded,
  ]);

  return (
    <>
      {hasCompletedAllSteps && (
        <div className="flex flex-col mx-2 my-4">
          {!isRemixSrcUploaded && (
            <div className="w-full flex gap-2 my-4">
              {uploadStatusIcon}
              <p>Uploading Source Files</p>
            </div>
          )}
          <div className="w-full flex gap-2 my-4">
            {verifyStatusIcon}
            <p>Verifing</p>
          </div>
          {verifyStatus === "error" && (
            <p className="text-red-500 text-sm">{verifyErrorMsg}</p>
          )}
        </div>
      )}
    </>
  );
};
