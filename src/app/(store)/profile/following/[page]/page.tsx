import FollowingContainer from "@/components/store/profile/following/following-container";
import { getUserFollowedStores } from "@/queries/profile.query";

interface Props {
  params: Promise<{ page: string }>;
}

export default async function ProfileFollowingPage({ params }: Props) {
  const page = (await params).page;
  const parsedPage = page ? Number(page) : 1;
  const res = await getUserFollowedStores(parsedPage);

  return (
    <div className="bg-white py-4 px-6">
      <h1 className="text-lg mb-3 font-bold">Stores you follow</h1>
      <FollowingContainer
        stores={res.stores}
        page={parsedPage}
        totalPages={res.totalPages}
      />
    </div>
  );
}
