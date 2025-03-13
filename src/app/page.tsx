import { UserButton } from "@clerk/nextjs";

import ThemeToggle from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <div className="w-100 flex justify-end space-x-4">
        <UserButton />
        <ThemeToggle />
      </div>
      <h1 className="font-barlow">Welcome</h1>
      <Button variant="destructive">Click me</Button>
    </div>
  );
}
