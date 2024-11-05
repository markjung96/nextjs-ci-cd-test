import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/src/shared/ui';
import { FileText } from 'lucide-react';

interface Transaction {
  chain: string;
  network: string;
  contractAddress: string;
  verifiedAt: string;
}

const transactions: Transaction[] = [
  {
    chain: 'Arbitrum',
    network: 'sepolia',
    contractAddress: '0x7395b3f7b3510887665beb894ee63de1d79993e3',
    verifiedAt: '1 hour ago',
  },
  {
    chain: 'Arbitrum',
    network: 'sepolia',
    contractAddress: '0x7395b3f7b3510887665beb894ee63de1d79993e3',
    verifiedAt: '1 day ago',
  },
  {
    chain: 'Arbitrum',
    network: 'sepolia',
    contractAddress: '0x7395b3f7b3510887665beb894ee63de1d79993e3',
    verifiedAt: '2 day ago',
  },
  {
    chain: 'Arbitrum',
    network: 'sepolia',
    contractAddress: '0x7395b3f7b3510887665beb894ee63de1d79993e3',
    verifiedAt: '3 day ago',
  },
  {
    chain: 'Arbitrum',
    network: 'sepolia',
    contractAddress: '0x7395b3f7b3510887665beb894ee63de1d79993e3',
    verifiedAt: '4 day ago',
  },
];

export function LatestVerification() {
  return (
    <Card className="w-[600px] border-slate-800">
      <CardContent className="p-0">
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-ml font-semibold">Latest Vertification</h2>
        </div>
        <ScrollArea className="h-[200px] p-4">
          {transactions.map((tx, index) => (
            <div key={index} className="flex items-start space-x-4 mb-4">
              <div className="mt-1">
                <FileText size={20} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium">{tx.chain}</p>
              <p className="text-sm font-medium">{tx.network}</p>
              <p className="text-xs text-gray-500">
                <span className="text-blue-500">{tx.contractAddress}</span>
              </p>
              <p className="text-xs text-gray-500">{tx.verifiedAt}</p>
            </div>
          ))}
        </ScrollArea>
        <div className="p-4 border-t border-slate-800">
          <Button className="w-full py-2 bg-gray-100 text-gray-600 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors">
            VIEW ALL VERIFICATION →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
