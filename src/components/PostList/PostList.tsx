import Link from "next/link";
import React from "react";
import { trpc } from "utils/trpc";

export const PostList = () => {
  const { data, isLoading, error } = trpc.useQuery(["getAllPosts"]);

  if (error) {
    return <p className="text-red-500">Error!</p>;
  }

  if (isLoading) {
    return <p className="text-blue-500">Loading..</p>;
  }

  const posts = data?.posts ?? [];

  return (
    <section aria-label="posts">
      <ul className="my-20 grid grid-cols-2 lg:grid-cols-4">
        {posts.length > 0
          ? posts.map(({ id, author, title }) => (
              <Link key={id} href={`/posts/${id}`}>
                <li className="m-4 list-none rounded-md bg-slate-800 p-4 text-center text-slate-100 shadow-lg transition-colors hover:cursor-pointer hover:text-slate-500">
                  <p>{author.name}</p>
                  <p>{title}</p>
                </li>
              </Link>
            ))
          : "No posts :("}
      </ul>
    </section>
  );
};
