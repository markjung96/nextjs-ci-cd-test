"use client";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { Step, type StepItem, Stepper, useStepper } from "@/src/widgets/Stpper";
import { Button, Input, Label } from "@/src/shared/ui";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/ui";

import { protocols } from "../const/protocol";

const steps = [
  { label: "Select protocol and network" },
  { label: "Input contract address" },
  { label: "Step 3" },
  { label: "Step 4" },
  { label: "Step 5" },
  { label: "Step 6" },
] satisfies StepItem[];

const VerificationStepper = () => {
  const [protocolInfo, setProtocolInfo] = useState<null | { protocol: string; network: string | undefined }>(null);
  const [address, setAddress] = useState<string>("");
  const [key, setKey] = useState(+new Date()); // 강제 새로고침

  useEffect(() => {
    setKey(+new Date());
  }, [protocolInfo?.protocol]);

  return (
    <div className="flex w-full flex-col gap-4">
      <Stepper orientation="vertical" initialStep={0} steps={steps} scrollTracking>
        {steps.map((stepProps, index) => {
          return (
            <Step key={stepProps.label} {...stepProps}>
              {index === 0 && (
                <div className="flex gap-4 my-4">
                  <div>
                    <Label>Protocol</Label>
                    <Select
                      value={protocolInfo?.protocol}
                      onValueChange={(protocol) => setProtocolInfo({ protocol, network: undefined })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Protocol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Protocols</SelectLabel>
                          {protocols.map((item) => {
                            const protocol = item.protocol;
                            return (
                              <SelectItem key={protocol} value={protocol.toLowerCase()}>
                                {protocol}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Network</Label>
                    <Select
                      key={key}
                      disabled={!protocolInfo}
                      value={protocolInfo?.network}
                      onValueChange={(network) => {
                        setProtocolInfo((prev) => {
                          if (!prev) return null;
                          return { ...prev, network };
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Network" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Networks</SelectLabel>
                          {protocolInfo?.protocol &&
                            protocols
                              .find((item) => item.protocol.toLowerCase() === protocolInfo.protocol)
                              ?.network.map((network) => (
                                <SelectItem key={network} value={network.toLowerCase()}>
                                  {network}
                                </SelectItem>
                              ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              {index === 1 && (
                <div className="my-4">
                  <Input placeholder="Input contract address" />
                </div>
              )}

              <StepButtons nextDisabled={!(protocolInfo && protocolInfo.network)} />
            </Step>
          );
        })}
        <FinalStep />
      </Stepper>
    </div>
  );
};

type StepButtonsProps = {
  nextDisabled?: boolean;
};
const StepButtons = (props: StepButtonsProps) => {
  const { nextStep, prevStep, isLastStep, isOptionalStep, isDisabledStep } = useStepper();

  return (
    <div className="w-full flex gap-2 mb-4">
      <Button disabled={isDisabledStep} onClick={prevStep} size="sm" variant="outline">
        Prev
      </Button>
      <Button size="sm" onClick={nextStep} disabled={props?.nextDisabled}>
        {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
      </Button>
    </div>
  );
};

const FinalStep = () => {
  const { hasCompletedAllSteps, resetSteps } = useStepper();

  if (!hasCompletedAllSteps) {
    return null;
  }

  return (
    <>
      <div className="h-40 flex items-center justify-center border bg-secondary text-primary rounded-md">
        <h1 className="text-xl">Woohoo! All steps completed! 🎉</h1>
      </div>
      <div className="w-full flex justify-end gap-2">
        <Button size="sm" onClick={resetSteps}>
          Reset
        </Button>
      </div>
    </>
  );
};

export default VerificationStepper;
