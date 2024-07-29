import { Badge } from "@/src/shared/ui/badge";
import { Button } from "@/src/shared/ui/button";
import { ThemeToggle } from "@/src/widgets/ThemeToggle";

type Props = {};
export function Header(props: Props) {
  return (
    <header className="flex items-center justify-between w-full px-4 py-2 dark:bg-gray-900 bg-gray-50">
      <div className="flex items-center">
        {/* <img src="/placeholder.svg" alt="Blockscan Logo" className="h-8 w-8" /> */}
        <span className="ml-2 text-xl font-bold">Welldone</span>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          A{/* <MoonIcon className="w-6 h-6" /> */}
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
