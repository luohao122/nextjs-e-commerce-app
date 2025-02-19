import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div className="h-screen w-full grid place-content-center">
      <SignUp />
    </div>
  );
}
