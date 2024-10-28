type ArbitrumNetwork = "ARBITRUM_ONE" | "ARBITRUM_SEPOLIA";

export interface StylusVerificationSrcUploadReqDto {
  network: ArbitrumNetwork;
  contractAddress: string;
  srcZipFile: File;
  compilerVersion: string;
}
export interface StylusVerificationSrcUploadResultDto {
  srcFileId: string;
}

const baseUrl = "https://verify.welldonestudio.io";

export const postStylusSourceCode = async (
  request: StylusVerificationSrcUploadReqDto
): Promise<StylusVerificationSrcUploadResultDto> => {
  const formData = new FormData();
  formData.append("network", request.network);
  formData.append("contractAddress", request.contractAddress);
  formData.append("srcZipFile", request.srcZipFile);
  formData.append("compilerVersion", request.compilerVersion);
  try {
    const response = await fetch(`${baseUrl}/arbitrum/verifications/sources`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()).data;
  } catch (error) {
    throw new Error("Failed to upload source code");
  }
};

export interface StylusVerificationReqDto {
  network: ArbitrumNetwork;
  contractAddress: string;
  srcFileId?: string;
  cliVersion: string;
}

export interface StylusVerificationResultDto {
  network: ArbitrumNetwork;
  contractAddress?: string;
  deploymentTxHash: string;
  verifiedSrcUrl?: string;
  cliVersion: string;
  errMsg?: string;
}

export const verifyStylus = async (
  request: StylusVerificationReqDto
): Promise<StylusVerificationResultDto> => {
  try {
    const response = await fetch(`${baseUrl}/arbitrum/verifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error("Failed to verify contract");
  }
};

export interface StylusVerificationCheckResultDto {
  network: ArbitrumNetwork;
  contractAddress?: string;
  deploymentTxHash: string;
  isRemixSrcUploaded: boolean;
  verifiedSrcUrl?: string;
  outFileUrl?: string;
  errMsg?: string;
  deployedCliVersion?: string;
  verifiedCliVersion?: string;
}

export const getStylusVerificationResult = async (
  network: ArbitrumNetwork,
  contractAddress: string
): Promise<StylusVerificationCheckResultDto> => {
  try {
    const response = await fetch(
      `${baseUrl}/arbitrum/verifications?network=${network}&contractAddress=${contractAddress}`,
      { headers: { "Cache-Control": "no-cache" } }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error("Failed to get verification result");
  }
};
