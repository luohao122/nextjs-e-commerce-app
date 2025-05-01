import { useRef } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";

import Input from "@/components/store/ui/input";

export default function UserDetails() {
  const { user } = useUser();

  const btnContainerRef = useRef<HTMLDivElement | null>(null);

  const handleImageClick = () => {
    const userButton = btnContainerRef.current?.querySelector("button");
    if (userButton) {
      userButton.click();
    }
  };

  return (
    <div className="w-full flex flex-col gap-y-4 justify-center items-center">
      <div className="relative">
        {/* User Image */}
        <Image
          src={user!.imageUrl!}
          alt="User avatar"
          width={200}
          height={200}
          className="rounded-full cursor-pointer"
          onClick={handleImageClick}
        />
        {/* Hidden UserButton */}
        <div
          ref={btnContainerRef}
          className="absolute inset-0 z-0 opacity-0 pointer-events-none"
        >
          <UserButton />
        </div>
      </div>
      {/* First Name Input */}
      <Input
        name="firstName"
        value={
          user?.firstName ||
          user?.primaryEmailAddress?.emailAddress ||
          "No name"
        }
        onChange={() => {}}
        type="text"
        readonly
      />
      {/* Last Name Input */}
      <Input
        name="lastName"
        value={
          user?.lastName || user?.primaryEmailAddress?.emailAddress || "No name"
        }
        onChange={() => {}}
        type="text"
        readonly
      />
    </div>
  );
}
