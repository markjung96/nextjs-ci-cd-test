import { cn } from "@/src/shared/lib/utils";
import { useStepper } from "@/src/widgets/Stpper";
import { Loader2, CircleCheck, Circle, CircleX } from "lucide-react";
import { ContractInfo } from "./page";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  postArbitrumStylusSourceCode,
  verifyArbitrumStylus,
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
        return <CircleCheck color="green"/>;
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
        return <CircleCheck color="green"/>;
      case "error":
        return <CircleX color="red" />;
    }
  }, [verifyStatus]);

  const uploadSourceFiles = useCallback(async () => {
    setUploadStatus("loading");
    try {
      const result = await postArbitrumStylusSourceCode({
        // FIXME: network 하드코딩 제거
        network: "ARBITRUM_SEPOLIA",
        contractAddress: contractInfo.contractAddress,
        srcZipFile: contractInfo.sourceFile!,
      });
      setUploadStatus("done");
      return result;
    } catch (error) {
      setUploadStatus("error");
    }
  }, [contractInfo]);

  const verifyContract = useCallback(
    async (srcFileId?: string) => {
      setVerifyStatus("loading");
      try {
        const result = await verifyArbitrumStylus({
          // FIXME: network 하드코딩 제거
          network: "ARBITRUM_SEPOLIA",
          contractAddress: contractInfo.contractAddress,
          srcFileId,
        });
        setVerifyStatus("done");
        if (result.verifiedSrcUrl) {
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
