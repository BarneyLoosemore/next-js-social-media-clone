import Head from "next/head";
import React, { ReactNode } from "react";
import Link from "next/link";

const NavLink: React.FC<{ children: ReactNode; href: string }> = ({
  children,
  href,
}) => (
  <Link href={href}>
    <li className="p-6 hover:cursor-pointer hover:text-slate-500 transition-colors font-extrabold text-slate-200">
      {children}
    </li>
  </Link>
);

export const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Next-JS Social Media Clone</title>
      </Head>
      <nav>
        <ul className="flex flex-row justify-evenly w-full  bg-slate-800 px-5">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/posts">Posts</NavLink>
          <NavLink href="">LINK 3</NavLink>
        </ul>
      </nav>
      <main>{children}</main>
      <footer>Footer</footer>
    </>
  );
};
