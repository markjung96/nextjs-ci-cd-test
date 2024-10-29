import { baseUrl } from ".";

type StarknetChainId = "0x534e5f4d41494e" | "0x534e5f5345504f4c4941";
export interface CairoVerificationSrcUploadReqDto {
  chainId: StarknetChainId;
  contractAddress: string;
  srcZipFile: File;
}
export interface CairoVerificationSrcUploadResultDto {
  chainId: StarknetChainId;
  contractAddress: string;
  srcFileId: string;
}

export const postCairoSourceCode = async (
  request: CairoVerificationSrcUploadReqDto
): Promise<CairoVerificationSrcUploadResultDto> => {
  const formData = new FormData();
  formData.append("chainId", request.chainId);
  formData.append("contractAddress", request.contractAddress);
  formData.append("srcZipFile", request.srcZipFile);
  try {
    const response = await fetch(`${baseUrl}/starknet/verifications/sources`, {
      method: "POST",
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

interface CairoVerificationReqDto {
  contractAddress: string;
  declareTxHash: string;
  scarbVersion: string;
  srcFileId: string;
  chainId: string;
}

export interface CairoVerificationResultDto {
  chainId: string;
  contractAddress: string;
  errMsg?: string;
  verifiedSrcUrl?: string;
  outFileUrl?: string;
}

export const verifyCairo = async (
  request: CairoVerificationReqDto
): Promise<CairoVerificationResultDto> => {
  try {
    const response = await fetch(`${baseUrl}/starknet/verifications`, {
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

export const getCairoVerificationResult = async (
  chainId: StarknetChainId,
  contractAddress: string
): Promise<CairoVerificationResultDto> => {
  try {
    const response = await fetch(
      `${baseUrl}/starknet/verifications?chainId=${chainId}&contractAddress=${contractAddress}`,
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
