import Link from "next/link";
import React from "react";

import { trpc } from "utils/trpc";

export const PostList = () => {
  const { data, isLoading, error, refetch } = trpc.useQuery(["getAllPosts"]);
  const { mutateAsync } = trpc.useMutation(["createPost"]);

  console.log({ data });

  if (error) {
    return <p className="text-red-500">Error!</p>;
  }

  if (isLoading) {
    return <p className="text-blue-500">Loading..</p>;
  }

  return (
    <section aria-label="posts">
      <ul className="grid grid-cols-2 lg:grid-cols-4 my-20">
        {data?.posts.map(({ id, author, title }) => (
          <Link key={id} href={`/posts/${id}`}>
            <li className="hover:cursor-pointer hover:text-slate-500 transition-colors p-4 m-4 bg-slate-400 text-center list-none shadow-lg rounded-md">
              <p>{author}</p>
              <p>{title}</p>
            </li>
          </Link>
        ))}
      </ul>
      <button
        aria-label="Add post"
        onClick={async () => {
          await mutateAsync({
            id: "100",
            title: "title-100",
            author: "author-2",
            published: true,
            createdAt: "today",
          });
          await refetch();
        }}>
        <h3>Add post</h3>
      </button>
    </section>
  );
};
