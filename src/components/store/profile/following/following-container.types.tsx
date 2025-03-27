export interface FollowingContainerProps {
  stores: {
    id: string;
    url: string;
    name: string;
    logo: string;
    followersCount: number;
    isUserFollowingStore: boolean;
  }[];
  page: number;
  totalPages: number;
}
