import { FC } from "react";

import { UserInfoProps } from "@/components/dashboard/user-info/user-info.types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const UserInfo: FC<UserInfoProps> = ({ user }) => {
  const role =
    user?.privateMetadata &&
    user.privateMetadata.role &&
    typeof user.privateMetadata.role === "string"
      ? user.privateMetadata.role.toString().toLowerCase()
      : "";

  return (
    <div>
      <div>
        <Button
          className="w-full mt-5 mb-4 flex items-center justify-between py-10"
          variant="ghost"
        >
          <div className="flex items-center text-left gap-2">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={user?.imageUrl}
                alt={`${user?.firstName} ${user?.lastName}`}
              />
              <AvatarFallback className="bg-primary text-white">
                {user?.firstName} {user?.lastName}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-y-1">
              {user?.firstName} {user?.lastName}
              <span className="text-muted-foreground">
                {user?.emailAddresses[0].emailAddress}
              </span>
              <span className="w-fit">
                <Badge variant="secondary" className="capitalize">
                  {role} Dashboard
                </Badge>
              </span>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default UserInfo;
