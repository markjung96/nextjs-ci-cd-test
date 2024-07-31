"use client";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Step, type StepItem, Stepper, useStepper } from "@/src/widgets/Stpper";
import { Button, Input, Tabs, TabsContent, TabsList, TabsTrigger, Textarea } from "@/src/shared/ui";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/ui";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/shared/ui";
import { addressSchema, multerFileSchema } from "@/src/shared/lib/zod-schema";

import { protocols } from "../const/protocol";
import { fileToMulterFile } from "@/src/shared/lib/utils";
import { Loader } from "@/src/widgets/Loader";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const formSchema = z.object({
  protocol: z.string().min(1, "field is required"),
  network: z.string().min(1, "field is required"),
  address: addressSchema,
  sourceCode: z.string().optional(),
  files: z.array(multerFileSchema).optional(),
});

const steps = [
  { label: "Select protocol and network" },
  { label: "Input contract address" },
  { label: "Verify codes" },
] satisfies StepItem[];

type FormValues = z.infer<typeof formSchema>;

const VerificationStepper = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      protocol: "",
      network: "",
      address: "",
      sourceCode: "",
      files: [],
    },
  });
  const [currentStep, setCurrentStep] = useState(0);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  const customHandleSubmit =
    (onValid: (data: FormValues) => void, onInvalid?: (errors: any) => void) =>
    async (event: React.BaseSyntheticEvent) => {
      // const { activeStep } = stepper;
      if (event) {
        event.preventDefault && event.preventDefault();
        event.persist && event.persist();
      }

      const fieldsToValidate: { [key: number]: (keyof FormValues)[] } = {
        0: ["protocol", "network"],
        1: ["address"],
        2: ["sourceCode", "files"],
      };

      const fields = fieldsToValidate[currentStep - 1] || [];
      const isValid = await form.trigger(fields);

      if (isValid) {
        const values = form.getValues();
        try {
          await onValid(values);
        } catch (error) {
          console.error(error);
        }
      } else {
        if (onInvalid) {
          const errors = form.formState.errors;
          await onInvalid(errors);
        }
      }
    };

  return (
    <div className="flex w-full flex-col gap-4">
      <Form {...form}>
        <form onSubmit={customHandleSubmit(onSubmit)}>
          <Stepper
            orientation="vertical"
            initialStep={0}
            steps={steps}
            scrollTracking
            onClickStep={(step, setStep) => {
              setStep(step);
            }}
          >
            {steps.map((stepProps, index) => {
              return (
                <Step key={stepProps.label} {...stepProps}>
                  {index === 0 && <FirstStep form={form} />}
                  {index === 1 && <SecondStep form={form} />}
                  {index === 2 && <ThirdStep form={form} />}
                </Step>
              );
            })}
            <StepFooter form={form} setCurrentStep={setCurrentStep} />
          </Stepper>
        </form>
      </Form>
    </div>
  );
};

const FirstStep = ({ form }: { form: UseFormReturn<FormValues> }) => {
  return (
    <div className="flex gap-4 mx-2 my-4">
      <FormField
        control={form.control}
        name="protocol"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Protocol</FormLabel>
              <FormControl>
                <Select
                  value={form.watch("protocol")}
                  onValueChange={(protocol) => {
                    form.setValue("protocol", protocol);
                    form.setValue("network", "");
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
                  disabled={!form.watch("protocol")}
                  value={form.watch("network")}
                  onValueChange={(network) => {
                    form.setValue("network", network);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Network" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Networks</SelectLabel>
                      {protocols
                        .find((item) => item.protocol.toLowerCase() === form.watch("protocol"))
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
  );
};

const SecondStep = ({ form }: { form: UseFormReturn<FormValues> }) => {
  return (
    <FormField
      control={form.control}
      name="address"
      render={({ field }) => {
        return (
          <FormItem className="mx-2 my-4">
            <FormLabel>Contract Address</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Input contract address" />
            </FormControl>
            <FormMessage>{form.formState.errors.address?.message}</FormMessage>
          </FormItem>
        );
      }}
    />
  );
};

const ThirdStep = ({ form }: { form: UseFormReturn<FormValues> }) => {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filePromises = Array.from(event.target.files).map(fileToMulterFile);
      const filesArray = await Promise.all(filePromises);
      form.setValue("files", filesArray);
    }
  };

  return (
    <Tabs defaultValue="sourceCode" className="mx-2 my-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="sourceCode">Source Code</TabsTrigger>
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
              </FormItem>
            );
          }}
        />
      </TabsContent>
    </Tabs>
  );
};

type StepButtonsProps = {
  form: UseFormReturn<FormValues>;
  setCurrentStep?: Dispatch<SetStateAction<number>>;
};
const StepFooter = ({ form, setCurrentStep }: StepButtonsProps) => {
  const { nextStep, prevStep, setStep, isDisabledStep, isOptionalStep, isLastStep } = useStepper();

  const validateCurrentStep = async () => {
    const result = await form.trigger();
    return result;
  };

  const handleNextClick = async () => {
    if (isLastStep) {
      const isValid = await validateCurrentStep();
      if (isValid) {
        nextStep();
        setCurrentStep?.((prev) => prev + 1);
      } else {
        const errors = form.formState.errors;
        const errorFields = Object.keys(errors);
        if (errorFields.length > 0) {
          // 해당 스텝으로 이동하기 위해 필드에 맞는 스텝을 찾음
          const stepIndex = steps.findIndex((step) => step.label.toLowerCase().includes(errorFields[0]));
          setStep(stepIndex);
          setCurrentStep?.(stepIndex);
        } else {
          setCurrentStep?.(0);
          console.log(form.getValues());
        }
      }
    } else {
      nextStep();
      setCurrentStep?.((prev) => prev + 1);
    }
  };

  return (
    <div className="w-full flex justify-end gap-2 m-2">
      <Button
        disabled={isDisabledStep}
        onClick={() => {
          prevStep();
          setCurrentStep?.((prev) => prev - 1);
        }}
        size="sm"
        variant="outline"
      >
        Prev
      </Button>
      <Button size="sm" onClick={handleNextClick}>
        {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
      </Button>
    </div>
  );
};

export default VerificationStepper;
