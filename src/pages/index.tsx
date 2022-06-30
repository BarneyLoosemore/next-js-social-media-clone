import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = ({ posts }) => {
  return (
    <>
      <Head>
        <title>Next-JS Social Media Clone</title>
      </Head>

      <main>
        <h1 className="text-3xl">Next JS social media clone</h1>
        {posts.map(({ title }) => {
          return <p>{title}</p>;
        })}
      </main>

      <footer></footer>
    </>
  );
};

export const getStaticProps = async () => {
  const res = await fetch("http://localhost:3000/api/posts");
  const posts = await res.json();
  return { props: { posts } };
};

export default Home;
