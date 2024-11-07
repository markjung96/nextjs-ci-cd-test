import { Button, Label } from '@/src/shared/ui';
import { useStepper } from '@/src/widgets/Stpper';
import { Dispatch, FC, SetStateAction } from 'react';
import { ContractInfo } from './page';
import { InputFile } from './input-file';

interface ContractInfoProps {
  contractInfo: ContractInfo;
  setContractInfo: Dispatch<SetStateAction<ContractInfo>>;
  isRemixSrcUploaded?: boolean;
}

export const ContractVerifyForm: FC<ContractInfoProps> = ({ contractInfo, setContractInfo, isRemixSrcUploaded }) => {
  const { prevStep, nextStep } = useStepper();
  return (
    <form className="space-y-6 mx-1">
      <ol className="p-2 [&>li:not(:first-child)]:mt-2 break-words md:list-disc md:px-6">
        <li>
          Does not support external libraries, constructor arguments, optimization settings or speficic compiler
          versions.
        </li>
        <li>Source code should be in zip file.</li>
      </ol>
      <div className="rounded-md p-2 dark:bg-gray-900 bg-gray-200">
        <ul className="p-1 [&>li:not(:first-child)]:mt-2 break-all md:list-disc md:px-6">
          <li>Chain : {contractInfo.chain}</li>
          <li>Network : {contractInfo.network}</li>
          <li>Contract Address: {contractInfo.contractAddress}</li>
          {contractInfo.chain === 'starknet' ? (
            <>
              <li>Declare TxHash: {contractInfo.declareTxHash}</li>
              <li>Scarb Version: {contractInfo.scarbVersion}</li>
            </>
          ) : (
            <li>Compiler Version: {contractInfo.compilerVersion}</li>
          )}
          <li>Compiler Type: {contractInfo.compilerType}</li>
        </ul>
      </div>
      <div>
        {isRemixSrcUploaded ? (
          <Label htmlFor="compiler-type" className="block text-sm font-medium">
            File has been uploaded
          </Label>
        ) : (
          <div className="relative grid grid-cols-1 gap-2">
            <Label htmlFor="compiler-type" className="block text-sm font-medium">
              Enter the contract {contractInfo.compilerType} Source Zip file
            </Label>
            <InputFile contractInfo={contractInfo} setContractInfo={setContractInfo} />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" className="px-4 py-2 text-sm font-medium rounded-md" onClick={prevStep}>
          prev
        </Button>
        <Button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          onClick={nextStep}
          disabled={!isRemixSrcUploaded && !contractInfo.sourceFile}
        >
          Verify
        </Button>
      </div>
    </form>
  );
};
