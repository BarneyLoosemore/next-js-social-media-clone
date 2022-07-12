import Link from "next/link";
import React, { FormEvent, useState } from "react";
import { trpc } from "utils/trpc";
import { Input } from "components/Input";
import { signIn } from "next-auth/react";

type ValidationErrors = {
  [key: string]: string;
} | null;

export const SignUpForm = () => {
  const [validationErrors, setValidationErrors] =
    useState<ValidationErrors>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const { mutate: createUser } = trpc.useMutation(["createUser"], {
    onError: (error) => {
      setSubmissionError(error.message);
      console.warn(error);
    },
    onSuccess: (res) => {
      if (res?.userAlreadyExistsError) {
        return setSubmissionError("User already exists");
      }
      if (res?.user) {
        const loginCredentials = {
          email: res?.user?.email,
          password: res?.user?.password,
        };
        signIn("sign-up-login", {
          ...loginCredentials,
          callbackUrl: "/",
        });
      }
    },
  });

  const handleValidationErrors = (event: FormEvent) => {
    const inputElement = event.target as HTMLInputElement;
    setValidationErrors((ers) => {
      if (!ers) {
        inputElement.focus();
      }
      return {
        ...ers,
        [inputElement.name]: inputElement.validationMessage,
      };
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const formElement = event.target as HTMLFormElement;

    // HACK: reset the validation errors on form re-submission, so focus can be set on highest level validation error in onInvalidCapture()
    setValidationErrors(null);
    if (formElement.checkValidity()) {
      const formData = {
        email: formElement.email.value,
        password: formElement.password.value,
      };
      await createUser(formData);
    }
  };

  return (
    <div className="flex flex-col items-center p-5 md:mt-24">
      <h1 className=" mt-8 max-w-md text-center text-3xl font-extrabold text-white md:text-4xl">
        Join The Fastest Growing Community
      </h1>
      <form
        className="my-6 flex w-full max-w-sm flex-col outline-4 outline-black"
        onSubmit={handleSubmit}
        onInvalidCapture={handleValidationErrors}
        noValidate>
        <Input
          name="email"
          label="Email"
          type="email"
          placeholder="email@email.comn"
          validationErrors={validationErrors}
          required
          minLength={3}
          maxLength={30}
        />
        <Input
          name="password"
          label="Password"
          type="password"
          placeholder="******"
          validationErrors={validationErrors}
          required
          minLength={3}
          maxLength={30}
        />
        <button
          aria-label="Sign Up"
          type="submit"
          className="my-6 rounded-md border-2 border-transparent  bg-sky-600 py-2 text-white transition-all hover:border-sky-600 hover:bg-transparent hover:text-sky-600 disabled:text-black">
          <p className="text-md font-bold ">Sign Up</p>
        </button>
        <p className="text-center text-sm font-bold text-white [&>a]:text-sky-500 [&>a]:hover:underline">
          Already have an account?&nbsp;
          <Link href="/sign-in">Log-in</Link>
        </p>
        {submissionError && (
          <p className="mt-4 text-center text-xl font-bold text-pink-500">
            {submissionError}
          </p>
        )}
      </form>
    </div>
  );
};
