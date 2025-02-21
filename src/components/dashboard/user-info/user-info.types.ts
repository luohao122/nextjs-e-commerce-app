import { User } from "@clerk/nextjs/server";

export interface UserInfoProps {
  user: User | null;
}
