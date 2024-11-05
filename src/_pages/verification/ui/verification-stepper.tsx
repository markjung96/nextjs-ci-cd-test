'use client';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Step, type StepItem, Stepper, useStepper } from '@/src/widgets/Stpper';
import { Button, FormDescription, Input, Tabs, TabsContent, TabsList, TabsTrigger, Textarea } from '@/src/shared/ui';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/ui';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/shared/ui';
import {
  aptosAddressSchema,
  suiAddressSchema,
  neutronAddressSchema,
  multerFileSchema,
} from '@/src/shared/lib/zod-schema';

import { protocols } from '../const/protocol';
import { fileToMulterFile } from '@/src/shared/lib/utils';
import { Loader } from '@/src/widgets/Loader';
import { BaseSyntheticEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { getSuiVerification } from '@/src/entities/verifications';
import { isSuiNetwork } from '@/src/entities/verifications/model/types';

const formSchema = z
  .object({
    protocol: z.string(),
    network: z.string(),
    moduleName: z.string(),
    address: z.string(),
    sourceCode: z.string().optional(),
    files: z.array(multerFileSchema).optional(),
  })
  .superRefine(({ protocol, address }, ctx) => {
    if (address.length > 0) {
      let isValid = false;
      switch (protocol.toLowerCase()) {
        case 'sui':
          isValid = suiAddressSchema.safeParse(address).success;
          break;
        case 'aptos':
          isValid = aptosAddressSchema.safeParse(address).success;
          break;
        case 'neutron':
          isValid = neutronAddressSchema.safeParse(address).success;
          break;
        default:
          isValid = false;
      }
      if (!isValid) {
        ctx.addIssue({ path: ['address'], message: 'Invalid address', code: z.ZodIssueCode.custom });
        return;
      }
    }
  });

const steps = [
  { label: 'Select protocol and network' },
  { label: 'Input contract address' },
  { label: 'Upload codes' },
  { label: 'Verify codes' },
] satisfies StepItem[];

type FormValues = z.infer<typeof formSchema>;

const VerificationStepper = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      protocol: '',
      network: '',
      moduleName: '',
      address: '',
      sourceCode: '',
      files: [],
    },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div className="flex w-full flex-col justify-center gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Stepper
            orientation="vertical"
            initialStep={0}
            steps={steps}
            state={loading ? 'loading' : undefined}
            scrollTracking
          >
            {steps.map((stepProps, index) => {
              return (
                <Step key={stepProps.label} {...stepProps}>
                  {index === 0 && <FirstStep form={form} />}
                  {index === 1 && <SecondStep form={form} loading={loading} setLoading={setLoading} />}
                  {index === 2 && <ThirdStep form={form} />}
                  {index === 3 && <ForthStep form={form} loading={loading} setLoading={setLoading} />}
                </Step>
              );
            })}
            <FinalStep form={form} />
          </Stepper>
        </form>
      </Form>
    </div>
  );
};

const FirstStep = ({ form }: { form: UseFormReturn<FormValues> }) => {
  const { nextStep } = useStepper();
  const { getValues } = form;

  const isDisabledNext = () => {
    const { protocol, network } = form.getValues();
    if (!protocol || !network) return true;
    else if (protocol.toLowerCase() === 'aptos' && !form.getValues('moduleName')) return true;
    return false;
  };

  return (
    <div className="flex flex-col mx-2 my-4">
      <div className="flex gap-4">
        <FormField
          control={form.control}
          name="protocol"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Protocol</FormLabel>
                <FormControl>
                  <Select
                    value={form.watch('protocol')}
                    onValueChange={(protocol) => {
                      form.reset();
                      form.setValue('protocol', protocol);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Protocol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Protocols</SelectLabel>
                        {protocols.map(({ protocol }) => {
                          return (
                            <SelectItem key={protocol} value={protocol.toLowerCase()}>
                              {protocol}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="network"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Network</FormLabel>
                <FormControl>
                  <Select
                    disabled={!form.watch('protocol')}
                    value={form.watch('network')}
                    onValueChange={(network) => {
                      form.setValue('network', network);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Network" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Networks</SelectLabel>
                        {protocols
                          .find((item) => item.protocol.toLowerCase() === form.watch('protocol'))
                          ?.network.map((network) => (
                            <SelectItem key={network} value={network.toLowerCase()}>
                              {network}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            );
          }}
        />
      </div>
      {getValues('protocol')?.toLowerCase() === 'aptos' && (
        <FormField
          control={form.control}
          name="moduleName"
          render={({ field }) => {
            return (
              <FormItem className="my-4">
                <FormLabel>Module Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Input module name" />
                </FormControl>
              </FormItem>
            );
          }}
        />
      )}
      <div className="w-full flex justify-end gap-2 my-4">
        <Button disabled={true} size="sm" variant="outline">
          Prev
        </Button>
        <Button size="sm" onClick={nextStep} disabled={isDisabledNext()}>
          Next
        </Button>
      </div>
    </div>
  );
};

const SecondStep = ({
  form,
  loading,
  setLoading,
}: {
  form: UseFormReturn<FormValues>;
  loading: boolean;
  setLoading: (value: boolean) => void;
}) => {
  const { prevStep, nextStep, setStep } = useStepper();
  const { watch, control } = form;
  const { protocol, network, address } = watch();
  const addressState = control.getFieldState('address');

  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    const handleAddressChange = async () => {
      if (addressState.invalid || !addressState.isTouched) return;
      if (protocol.toLowerCase() === 'sui' && isSuiNetwork(network)) {
        setLoading(true);
        const response = await getSuiVerification({ packageId: address, network });
        if (!response) return;
        if (response.isVerified) {
          setDescription('This contract already has been verified');
        } else if (!response.isRemixSrcUploaded) {
          setDescription('Before verification, you need to upload the source code to remix');
        }
        setLoading(false);
      }
    };

    handleAddressChange();
  }, [address]);

  return (
    <FormField
      control={form.control}
      name="address"
      render={({ field }) => {
        return (
          <div className="flex flex-col mx-2 my-4">
            <FormItem>
              <FormLabel>Contract Address</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Input contract address" />
              </FormControl>
              <FormMessage>
                {form.formState.errors.address ? form.formState.errors.address.message : description}
              </FormMessage>
              {/* <FormMessage>{form.formState.}</FormMessage> */}
            </FormItem>
            <div className="w-full flex justify-end gap-2 my-4">
              <Button onClick={prevStep} size="sm" variant="outline">
                Prev
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  if (description.includes('verified')) setStep(steps.length);
                  else nextStep();
                }}
                disabled={!form.getValues('address')}
              >
                {loading ? <Loader /> : 'Next'}
              </Button>
            </div>
          </div>
        );
      }}
    />
  );
};

const ThirdStep = ({ form }: { form: UseFormReturn<FormValues> }) => {
  const { prevStep, nextStep, setStep } = useStepper();
  const protocol = form.getValues('protocol');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filePromises = Array.from(event.target.files).map(fileToMulterFile);
      const filesArray = await Promise.all(filePromises);
      form.setValue('files', filesArray);
    }
  };

  return (
    <div className="flex flex-col mx-2 my-4">
      <Tabs defaultValue="sourceCode">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sourceCode" disabled={protocol.toLowerCase() === 'sui'}>
            Source Code
          </TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>
        <TabsContent value="sourceCode">
          <FormField
            control={form.control}
            name="sourceCode"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Source Code</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Input source code" />
                  </FormControl>
                </FormItem>
              );
            }}
          />
        </TabsContent>
        <TabsContent value="files">
          <FormField
            control={form.control}
            name="files"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Files</FormLabel>
                  <FormControl>
                    <Input type="file" multiple onChange={handleFileChange} />
                  </FormControl>
                  <FormDescription>Please select the contract (*.zip) files for upload</FormDescription>
                </FormItem>
              );
            }}
          />
        </TabsContent>
      </Tabs>
      <div className="w-full flex justify-end gap-2 my-4">
        <Button onClick={prevStep} size="sm" variant="outline">
          Prev
        </Button>
        <Button size="sm" onClick={nextStep} disabled={!form.getValues('address')}>
          Next
        </Button>
      </div>
    </div>
  );
};

const ForthStep = ({
  form,
  loading,
  setLoading,
}: {
  loading: boolean;
  setLoading: (value: boolean) => void;
  form: UseFormReturn<FormValues>;
}) => {
  const { prevStep } = useStepper();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    await sleep(1000);
    setLoading(false);
    console.log(values);
  };

  return (
    <div className="flex flex-col mx-2 my-4">
      <div className="p-4 border rounded-md">
        <ul>Protocol: {form.getValues('protocol')}</ul>
        <ul>Network: {form.getValues('network')}</ul>
        <ul>Address: {form.getValues('address')}</ul>
        <ul>Source Code: {form.getValues('sourceCode')}</ul>
      </div>
      <div className="w-full flex justify-end gap-2 my-4">
        <Button onClick={prevStep} size="sm" variant="outline">
          Prev
        </Button>
        <Button size="sm" onClick={form.handleSubmit(onSubmit)}>
          {loading ? <Loader /> : 'Verify code'}
        </Button>
      </div>
    </div>
  );
};

const FinalStep = ({ form }: { form: UseFormReturn<FormValues> }) => {
  const { hasCompletedAllSteps, prevStep } = useStepper();

  if (!hasCompletedAllSteps) return null;

  return (
    <div className="flex flex-col mx-2 my-4">
      <div className="w-full flex justify-end gap-2 my-4">
        <Button onClick={prevStep} size="sm" variant="outline">
          Prev
        </Button>
      </div>
    </div>
  );
};

// type StepButtonsProps = {
//   form: UseFormReturn<FormValues>;
// };
// const StepFooter = ({ form }: StepButtonsProps) => {
//   const { nextStep, prevStep, isDisabledStep, isOptionalStep, isLastStep, isLoading, setStep } = useStepper();

//   const validateCurrentStep = async () => {
//     const result = await form.trigger();
//     return result;
//   };

//   const handleNextClick = async () => {
//     if (isLastStep) {
//       const isValid = await validateCurrentStep();
//       if (isValid) {
//         nextStep();
//       } else {
//         const errors = form.formState.errors;
//         const errorFields = Object.keys(errors);
//         if (errorFields.length > 0) {
//           // 해당 스텝으로 이동하기 위해 필드에 맞는 스텝을 찾음
//           const stepIndex = steps.findIndex((step) => step.label.toLowerCase().includes(errorFields[0]));
//           setStep(stepIndex);
//         } else {
//         }
//       }
//     } else {
//       nextStep();
//     }
//   };

//   return (
//     <div className="w-full flex justify-end gap-2 m-2">
//       <Button disabled={isDisabledStep} onClick={prevStep} size="sm" variant="outline">
//         Prev
//       </Button>
//       <Button size="sm" onClick={handleNextClick}>
//         {isLoading ? <Loader /> : isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
//       </Button>
//     </div>
//   );
// };

export default VerificationStepper;

const sleep = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
