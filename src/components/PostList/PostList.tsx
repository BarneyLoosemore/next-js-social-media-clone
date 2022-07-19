import Image from "next/future/image";
import Link from "next/link";
import React from "react";
import { trpc } from "utils/trpc";
import type { InferQueryOutput } from "utils/trpc";

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
      <ul className="my-20 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {posts.length > 0
          ? posts.map((post) => <Post key={post.id} {...post} />)
          : "No posts :("}
      </ul>
    </section>
  );
};

type PostType = InferQueryOutput<"getAllPosts">["posts"][number];

const Post = ({ id, author, text, image, createdAt }: PostType) => {
  return (
    <li className="aspect-square list-none rounded-md bg-slate-800 p-4 text-center text-slate-100 shadow-lg transition-colors hover:cursor-pointer hover:text-slate-500">
      <Link key={id} href={`/posts/${id}`} passHref>
        <a>
          <p>{author?.email ?? "anonymous"}</p>
          <p>{createdAt.toString()}</p>
          <p>{text}</p>
          {image && (
            // BUG: when query revalidated, new image not working - URL has undefined properties (`version`, etc.)
            <Image
              alt="Post image"
              src={`https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/v${image.version}/${image.publicId}.${image.format}`}
              key={image.publicId}
              height={100}
              width={100}
            />
          )}
        </a>
      </Link>
    </li>
  );
};
