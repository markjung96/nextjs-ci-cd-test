export interface EthereumVerificationSrcUploadReqDto {
  protocol: "ethereum" | "arbitrum";
  chainId: "0x1" | "0xaa36a7" | "0x4268";
  contractAddress: string;
  srcZipFile: File;
}
export interface EthereumVerificationSrcUploadResultDto {
  srcFileId: string;
}

const baseUrl = "https://verify.welldonestudio.io";

export const postSoliditySourceCode = async (
  request: EthereumVerificationSrcUploadReqDto
): Promise<EthereumVerificationSrcUploadResultDto> => {
  const formData = new FormData();
  formData.append("protocol", "ethereum");
  formData.append("chainId", request.chainId);
  formData.append("contractAddress", request.contractAddress);
  formData.append("srcZipFile", request.srcZipFile);
  for (const x of Array.from(formData.entries())) {
    console.log(x);
   };
  try {
    const response = await fetch(`${baseUrl}/evm/verifications/sources`, {
      method: "POST",
      // headers: {
      //   accept: "application/json",
      //   "Content-Type": "multipart/form-data",
      // },
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

interface EvmVerificationReqDto {
  optimize: string;
  optimizeRuns: string;
  evmVersion: string;
  compilerVersion: string;
  contractAddress: string;
  protocol: string;
  chainId: string;
}

export interface EvmVerificationResultDto {
  protocol: string;
  chainId: string;
  contractAddress: string;
  isVerified: boolean;
  errMsg?: string;
}

export const verifySolidity = async (
  request: EvmVerificationReqDto
): Promise<EvmVerificationResultDto> => {
  try {
    const response = await fetch(`${baseUrl}/evm/verifications`, {
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

export const getSolidityVerificationResult = async (
  protocol: "ethereum" | "arbitrum",
  chainId: "0x1" | "0xaa36a7" | "0x4268",
  contractAddress: string
): Promise<EvmVerificationResultDto> => {
  try {
    const response = await fetch(
      `${baseUrl}/evm/verifications?protocol=${protocol}&chainId=${chainId}&contractAddress=${contractAddress}`,
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
