import { SignInForm } from "components/SignInForm";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const SignIn = () => {
  const { status } = useSession();
  const { push } = useRouter();

  if (status === "loading") {
    return null;
  }

  if (status === "authenticated") {
    push("/");
  }

  return (
    <div className="my-16 flex w-full flex-col items-center justify-center">
      <button
        type="button"
        onClick={() => signIn("github")}
        className="button button__secondary inline-flex space-x-2">
        <img
          alt="Github logo"
          className="h-16 w-16 bg-white"
          src={`/assets/github.svg`}
        />
        <p className="text-3xl font-extrabold text-white">Github</p>
      </button>
      <SignInForm />
    </div>
  );
};

export default SignIn;
