import { ThemeToggle } from "@/src/widgets/ThemeToggle";
import { Logo } from "@/src/widgets/Logo";
import { Separator } from "@/src/shared/ui";
import Link from "next/link";

type Props = {};
export function Header(props: Props) {
  return (
    <header className="flex items-center justify-between w-full px-4 py-2 dark:bg-gray-900 bg-gray-50">
      <div className="flex h-10 items-center">
        <Logo />
        <Separator orientation="vertical" className="mx-8" />
      </div>
      <div className="flex flex-grow gap-8 items-center justify-start">
        <Link href="/verify" className="font-bold">
          Verify
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
