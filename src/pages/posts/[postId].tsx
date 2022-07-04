import type { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";

const Posts: NextPage = () => {
  const {
    query: { postId },
  } = useRouter();

  const { data, error, isLoading } = trpc.useQuery(["getPost", String(postId)]);

  if (error) {
    return <p className="text-red-500">Error!</p>;
  }

  if (isLoading) {
    return <p className="text-blue-500">Loading..</p>;
  }

  if (!data) {
    return <p>404: post not found!</p>;
  }

  return <p>{data?.post?.title}</p>;
};

export default Posts;
