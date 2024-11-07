import { isValidHexAddress, type Hex } from '@metamask/utils';

/**
 * Checks if an address is an ethereum one.
 *
 * @param address - An address.
 * @returns True if the address is an ethereum one, false otherwise.
 */
export const isEthAddress = (address: string): boolean => isValidHexAddress(address as Hex);

/**
 * Checks if an address is a Starknet one.
 *
 * @param address - An address.
 * @returns True if the address is a Starknet one, false otherwise.
 */
export const isStarknetAddress = (address: string): boolean => {
  // Starknet addresses are 42 characters long.
  const starknetAddressRegex = /^0x[a-fA-F0-9]{64}$/;
  return starknetAddressRegex.test(address);
};
