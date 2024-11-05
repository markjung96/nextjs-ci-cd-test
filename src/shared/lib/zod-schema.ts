import { z } from 'zod';
import { fromBech32, toBech32 } from '@cosmjs/encoding';

const aptosAddressSchema = z.string().regex(/^0x[a-fA-F0-9]{64}$/, { message: 'Invalid Aptos address' });
const suiAddressSchema = z.string().regex(/^0x[a-fA-F0-9]{64}$/, { message: 'Invalid Sui address' });
const neutronAddressSchema = z.string().refine(
  (address) => {
    try {
      const decoded = fromBech32(address);
      return address.startsWith('cosmos');
    } catch (error) {
      return false;
    }
  },
  {
    message: 'Invalid Neutron address',
  },
);
const multerFileSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string(),
  size: z.number(),
  buffer: z.instanceof(Buffer),
});

export { aptosAddressSchema, suiAddressSchema, neutronAddressSchema, multerFileSchema };
