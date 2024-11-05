import { Input } from '@/src/shared/ui';
import { Label } from '@/src/shared/ui';

type Props = { label?: string };
export const InputFile = (props: Props) => (
  <div className="grid w-full max-w-sm items-center gap-1.5">
    {props.label && <Label htmlFor="picture">{props.label}</Label>}
    <Input id="picture" type="file" />
  </div>
);
