export interface ArbitrumVerificationSrcUploadReqDto {
  network: string;
  deploymentTxHash: string;
  srcZipFile: File;
}

export interface ArbitrumVerificationSrcUploadResultDto {
  srcFileId: string;
}

const baseUrl = "https://verify.welldonestudio.io";

export const postArbitrumStylusSourceCode = async (
  request: ArbitrumVerificationSrcUploadReqDto
): Promise<ArbitrumVerificationSrcUploadResultDto> => {
  const formData = new FormData();
  formData.append("network", request.network);
  formData.append("deploymentTxHash", request.deploymentTxHash);
  formData.append("srcZipFile", request.srcZipFile);
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

export interface ArbitrumVerificationReqDto {
  network: string;
  deploymentTxHash: string;
  srcFileId?: string;
}

export interface ArbitrumVerificationResultDto {
  network: string;
  contractAddress?: string;
  deploymentTxHash: string;
  isVerified: boolean;
  verifiedSrcUrl?: string;
  nullable: true;
  errMsg?: string;
}

export const verifyArbitrumStylus = async (
  request: ArbitrumVerificationReqDto
): Promise<ArbitrumVerificationResultDto> => {
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
    return (await response.json()).data;
  } catch (error) {
    throw new Error("Failed to verify contract");
  }
};

interface ArbitrumVerificationCheckResultDto {
  network: string;
  contractAddress?: string;
  deploymentTxHash: string;
  isVerified: boolean;
  isRemixSrcUploaded: boolean;
  verifiedSrcUrl?: string;
  errMsg?: string;
}

export const getVerificationResult = async (
  network: string,
  deploymentTxHash: string
): Promise<ArbitrumVerificationCheckResultDto> => {
  try {
    const response = await fetch(
      `${baseUrl}/arbitrum/verifications?network=${network}&deploymentTxHash=${deploymentTxHash}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json());
  } catch (error) {
    throw new Error("Failed to get verification result");
  }
};
