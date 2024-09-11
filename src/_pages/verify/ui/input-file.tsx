import { Input, Label } from "@/src/shared/ui";
import { Dispatch, FC, SetStateAction } from "react";
import { ContractInfo } from "./page";

type Props = {
  contractInfo: ContractInfo;
  setContractInfo: Dispatch<SetStateAction<ContractInfo>>;
};
export const InputFile: FC<Props> = ({ contractInfo, setContractInfo }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // e.target.files
      setContractInfo((prev) => ({
        ...prev,
        sourceFile: e.target.files?.[0] || null,
      }));
    }
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Input id="picture" type="file" onChange={handleFileChange} />
      {contractInfo.sourceFile && (
        <Label htmlFor="picture" className="text-sm">
          {contractInfo.sourceFile.name}
        </Label>
      )}
    </div>
  );
};
