import { AptosNetwork, NeutronChainId, SuiNetwork } from "@/src/entities/verifications/model/types";

export const protocols: {
  protocol: "SUI" | "Aptos" | "Neutron";
  network: (SuiNetwork | AptosNetwork | NeutronChainId)[];
}[] = [
  {
    protocol: "SUI",
    network: ["mainnet", "testnet", "devnet"] satisfies SuiNetwork[],
  },
  {
    protocol: "Aptos",
    network: ["mainnet", "testnet", "devnet"] satisfies AptosNetwork[],
  },
  {
    protocol: "Neutron",
    network: ["neutron-1", "pion-1"] satisfies NeutronChainId[],
  },
];
