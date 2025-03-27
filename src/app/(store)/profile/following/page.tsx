import { redirect } from "next/navigation";

import { ROUTES } from "@/config/route-name";

export default function ProfileFollowingPage() {
  redirect(ROUTES.PROFILE_FOLLOWING_REDIRECT);
}
