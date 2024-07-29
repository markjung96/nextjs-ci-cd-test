// General Type
export type VerificationStatus = "VERIFIED_SAME" | "VERIFIED_DIFFERENT" | "NOT_VERIFIED";

// Aptos Type
export type AptosNetwork = "mainnet" | "testnet" | "devnet";

// Sui Type
export type SuiNetwork = "mainnet" | "testnet" | "devnet";
export type SuiVerificationModule = {
  modueName: string; // clock
  isVerified: boolean; // true
  onChainByteCode: string | null; // 0xa11ceb0b060000000901000802080c031410042402052614073a4c088601400ac601050ccb010f0003010301050108000103000100080003020200000600010001070203000204050101030204020608010708020001060801010301080001090005436c6f636b0954696d654576656e74095478436f6e7465787405636c6f636b04656d6974056576656e74086765745f74696d650c74696d657374616d705f6d730a74785f636f6e74657874487cfcc93e4eb903dcb1d0370fe4048cbfd88dfa5d78dabbdb12b4084325a568000000000000000000000000000000000000000000000000000000000000000200020107030001040001050b001101120038000200
  offChainByteCode: string | null; // 0xa11ceb0b060000000901000802080c031410042402052614073a4c088601400ac601050ccb010f0003010301050108000103000100080003020200000600010001070203000204050101030204020608010708020001060801010301080001090005436c6f636b0954696d654576656e74095478436f6e7465787405636c6f636b04656d6974056576656e74086765745f74696d650c74696d657374616d705f6d730a74785f636f6e74657874487cfcc93e4eb903dcb1d0370fe4048cbfd88dfa5d78dabbdb12b4084325a568000000000000000000000000000000000000000000000000000000000000000200020107030001040001050b001101120038000200
};
export type SuiSourceCode = {
  path: string; // Move.toml
  isDirectory: boolean; // false
  sourceCode: string; // `"[package]\\nname = \\"my_first_package\\"\\nversion = \\"0.0.1\\"\\n\\n[dependencies]\\nSui = { git = \\"https://github.com/MystenLabs/sui.git\\", subdir=\\"crates/sui-framework/packages/sui-framework/\\", rev = \\"testnet\\" }\\n\\n[addresses]\\nmy_first_package = \\"0x0\\"\\nsui = \\"0000000000000000000000000000000000000000000000000000000000000002\\""`
};
export type SuiModuleSourceCode = Record<string, string | null>;

// Neutron Type
export type NeutronChainId = "pion-1" | "neutron-1";
export type NeutronVerification = {
  chainId: NeutronChainId; // pion-1
  contractAddress: string; // neutron19qdpnkxmrh8p6emrtf6303pdzclhxhsr8mrzle4lmp2lqvs22hpqqt90gw
  isVerified: boolean; // true
  onchainCodeId: number; // 538
  historyCodeId: number; // 538
  isImmutable: boolean; // true
  envOsMachine: string | null; // null
  envOsName: string | null; // 'x86_64'
  envOsVersion: string | null; // 'Ubuntu'
  envRustcVersion: string | null; // 22.04.1
  envCargoWasmVersion: string | null; // 0.6.0
  envBuildScript: string | null; // 0.4.1
  envOptimizerScript: string | null; // cargo wasm build
  errMsg: string | null; // docker run --rm -v "$(pwd)":/code --mount type=volume,source="$(basename "$(pwd)")_cache",target=/code/target --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry cosmwasm/rust-optimizer:0.12.11
  srcUrl: string | null; // https://wds-storage.com/neutron/neutron-1/neutron1tpurcpqmd8au3waymfajxd3z5n796p5cleqjrs/src.zip
  schemaUrl: string | null; // https://wds-storage.com/neutron/neutron-1/neutron1tpurcpqmd8au3waymfajxd3z5n796p5cleqjrs/schema.zip
};
export type NeutronDeployHistorySingle = {
  chainId?: NeutronChainId; // pion-1
  account?: string;
  codeId?: string; // 538
  contract?: string; // neutron19qdpnkxmrh8p6emrtf6303pdzclhxhsr8mrzle4lmp2lqvs22hpqqt90gw
  txHash?: string | null; // D01F2C4BCF4B5E921492D7480930E68800DA90F959563EC916ED889138832FA8
  error?: string;
};
export type NeutronSourceCode = {
  path: string; // Cargo.toml
  isDirectory: boolean; // false
  sourceCode: string; // [package]\nname = "my-first-contract"\nversion = "0.1.0"\nauthors = ["0xhsy <sooyoung.hyun@dsrvlabs.com>"]\nedition = "2018"\n\nexclude = [\n  # Those files are rust-optimizer artifacts. You might want to commit them for convenience but they should not be part of the source code publication.\n  "contract.wasm",\n  "hash.txt",\n]\n\n# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html\n\n[lib]\ncrate-type = ["cdylib", "rlib"]\n\n[profile.release]\nopt-level = 3\ndebug = false\nrpath = false\nlto = true\ndebug-assertions = false\ncodegen-units = 1\npanic = \'abort\'\nincremental = false\noverflow-checks = true\n\n[features]\n# for more explicit tests, cargo test --features=backtraces\nbacktraces = ["cosmwasm-std/backtraces"]\n# use library feature to disable all instantiate/execute/query exports\nlibrary = []\n\n[dependencies]\ncosmwasm-std = "1.0.0"\ncosmwasm-storage = "1.0.0"\ncw-storage-plus = "0.13.2"\ncw2 = "0.13.2"\nschemars = "0.8.8"\nserde = { version = "1.0.137", default-features = false, features = ["derive"] }\nthiserror = { version = "1.0.31" }\n\n[dev-dependencies]\ncosmwasm-schema = "1.0.0"\ncw-multi-test = "0.13.2"\n
};
export type NeutronSchema = {
  path: string; // state.json
  isDirectory: boolean; // false
  sourceCode: string; // {\n  "$schema": "http://json-schema.org/draft-07/schema#",\n  "title": "ExecuteMsg",\n  "oneOf": [\n    {\n      "type": "object",\n      "required": [\n        "increment"\n      ],\n      "properties": {\n        "increment": {\n          "type": "object"\n        }\n      },\n      "additionalProperties": false\n    },\n    {\n      "type": "object",\n      "required": [\n        "reset"\n      ],\n      "properties": {\n        "reset": {\n          "type": "object",\n          "required": [\n            "count"\n          ],\n          "properties": {\n            "count": {\n              "type": "integer",\n              "format": "int32"\n            }\n          }\n        }\n      },\n      "additionalProperties": false\n    }\n  ]\n}\n
};
