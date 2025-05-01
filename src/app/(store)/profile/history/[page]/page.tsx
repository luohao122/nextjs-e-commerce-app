import HistoryPageContainer from "@/components/store/profile/history/history-page-container";

export default async function ProfileHistoryPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const page = (await params).page;

  return <HistoryPageContainer page={page} />;
}
