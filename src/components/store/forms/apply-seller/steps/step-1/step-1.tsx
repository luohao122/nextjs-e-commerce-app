import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

import { UserCircle } from "lucide-react";

import AnimatedContainer from "@/components/store/forms/apply-seller/animated-container";
import { Button } from "@/components/store/ui/button";
import UserDetails from "@/components/store/forms/apply-seller/steps/step-1/user-details";

export default function Step1({
  step,
  setStep,
  totalStep
}: {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  totalStep: number
}) {
  const { isSignedIn } = useUser();
  const [user, setUser] = useState<boolean>(false);

  useEffect(() => {
    if (isSignedIn) {
      setUser(isSignedIn);
    }
  }, [isSignedIn]);

  return (
    <div className="w-full">
      <AnimatedContainer>
        {isSignedIn && user ? (
          <UserDetails />
        ) : (
          <div className="h-full">
            <div className="h-full flex flex-col justify-center space-y-4">
              <div className="w-full bg-blue-100 border border-blue-200 text-sm text-blue-800 rounded-lg ">
                <div className="flex p-4">
                  Please sign in (Or sign up if you are new) to start
                </div>
              </div>
              <div className="flex items-center justify-center">
                <UserCircle size={200} />
              </div>
              <div className="flex flex-col gap-y-3">
                <Link href="/sign-in">
                  <Button>Sign in</Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant="pink">Sign up</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </AnimatedContainer>
      {isSignedIn && (
        <div className="h-[100px] flex pt-4 px-2 justify-between">
          <button
            type="button"
            onClick={() => step > 1 && setStep((prev) => prev - 1)}
            className="h-10 py-2 px-4 rounded-lg shadow-sm text-gray-600 bg-white hover:bg-gray-100 font-medium border"
          >
            Previous
          </button>
          <button
            type="submit"
            onClick={() => step < totalStep && setStep((prev) => prev + 1)}
            className="h-10 py-2 px-4 rounded-lg shadow-sm text-white bg-blue-500 hover:bg-blue-700 font-medium"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
