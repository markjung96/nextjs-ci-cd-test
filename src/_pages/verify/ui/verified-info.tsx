import { FC } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/shared/ui";
import { CodeExplorer } from "./code-explorer";
import { ContractInteract } from "./contract-interact";

interface VerifiedInfoProps {
  chain: string;
  network: string;
  contractAddress: string;
  verifiedSrcUrl: string;
  outFileUrl?: string;
}

export const VerifiedInfo: FC<VerifiedInfoProps> = ({
  chain,
  network,
  contractAddress,
  verifiedSrcUrl,
  outFileUrl,
}) => {
  return (
    <>
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
        <p className="block sm:inline">
          Contract {contractAddress} has been verified
        </p>
        <br />
        <p className="block sm:inline">
          You can download the verified source code{" "}
          <a href={verifiedSrcUrl} className="text-blue-600" download>
            here
          </a>
        </p>
      </div>
      <Tabs defaultValue="code">
        <TabsList>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="interact">Interact</TabsTrigger>
        </TabsList>
        <TabsContent value="code">
          <CodeExplorer url={verifiedSrcUrl} />
        </TabsContent>
        <TabsContent value="interact">
          {outFileUrl && (
            <ContractInteract
              chain={chain}
              network={network}
              outFileUrl={outFileUrl}
              contractAddress={contractAddress!}
            />
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};
