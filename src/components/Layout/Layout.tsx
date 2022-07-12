import Head from "next/head";
import React, { ReactNode } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const NavLink: React.FC<{ children: ReactNode; href: string }> = ({
  children,
  href,
}) => (
  <Link href={href}>
    <li className="p-6 font-extrabold text-slate-200 transition-colors hover:cursor-pointer hover:text-slate-500">
      {children}
    </li>
  </Link>
);

export const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { status } = useSession();

  return (
    <>
      <Head>
        <title>Next-JS Social Media Clone</title>
      </Head>
      <nav>
        <ul className="flex w-full flex-row justify-evenly  bg-slate-800 px-5">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/sign-up">Sign Up</NavLink>
          {status === "authenticated" ? (
            <button
              onClick={async () => await signOut()}
              className="p-6 font-extrabold text-slate-200 transition-colors hover:cursor-pointer hover:text-slate-500">
              Sign out
            </button>
          ) : (
            <NavLink href="/sign-in">Sign In</NavLink>
          )}
        </ul>
      </nav>
      <main>{children}</main>
      <footer>Footer</footer>
    </>
  );
};
