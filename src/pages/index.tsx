import type { NextPage } from "next";
import { PostList } from "components/PostList";
import { CreatePostForm } from "components/CreatePostForm";

const Posts: NextPage = () => {
  return (
    <div>
      <CreatePostForm />
      {/* <PostList /> */}
    </div>
  );
};

export default Posts;
