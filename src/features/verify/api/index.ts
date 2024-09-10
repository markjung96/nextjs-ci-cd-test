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
  const response = await fetch(`${baseUrl}/arbitrum/verifications/sources`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  });
  return (await response.json()).data;
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
  const response = await fetch(`${baseUrl}/arbitrum/verifications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  return (await response.json()).data;
};
