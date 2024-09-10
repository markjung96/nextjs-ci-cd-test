import { Button, Label } from "@/src/shared/ui";
import { useStepper } from "@/src/widgets/Stpper";
import { Dispatch, FC, SetStateAction } from "react";
import { ContractInfo } from "./page";
import { InputFile } from "./input-file";

const compilerTypes = ["stylus"];
const compilerVersions = ["0.5.2"];

interface ContractInfoProps {
  contractInfo: ContractInfo;
  setContractInfo: Dispatch<SetStateAction<ContractInfo>>;
}

export const ContractVerifyForm: FC<ContractInfoProps> = ({
  contractInfo,
  setContractInfo,
}) => {
  const { prevStep, nextStep } = useStepper();
  return (
    <form className="space-y-4">
      <div>
        <ol className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>
            The Stylus contract source code verifier is experimental and subject
            to change.
          </li>
          <li>
            Does not support external libraries, constructor arguments,
            optimization settings or speficic compiler versions.
          </li>
          <li>Source code should be in zip file.</li>
        </ol>
      </div>
      <div className="rounded-md p-1 dark:bg-gray-900 bg-gray-200">
        <ol className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>Contract Address: {contractInfo.contractAddress}</li>
          <li>Compiler Type: {contractInfo.compilerType}</li>
          <li>Compiler Version: {contractInfo.compilerVersion}</li>
        </ol>
      </div>
      <div>
        <Label htmlFor="compiler-type" className="block text-sm font-medium ">
          Enter the contract Stylus Source Zip file
        </Label>
        <InputFile contractInfo={contractInfo} setContractInfo={setContractInfo} />
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          className="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-300"
          onClick={() => prevStep()}
        >
          prev
        </Button>
        <Button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          onClick={() => nextStep()}
          disabled={!contractInfo.sourceFile}
        >
          Verify
        </Button>
      </div>
    </form>
  );
};
