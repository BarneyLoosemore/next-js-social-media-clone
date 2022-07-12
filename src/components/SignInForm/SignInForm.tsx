import { Input } from "components/Input";
import { Loader } from "components/Loader";
import { signIn } from "next-auth/react";
import React, { FormEvent, useState } from "react";
import { trpc } from "utils/trpc";

type ValidationErrors = {
  [key: string]: string;
} | null;

// TODO: audit the site for semantic html and general a11y
export const SignInForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] =
    useState<ValidationErrors>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

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
    setIsSubmitting(true);
    event.preventDefault();
    const formElement = event.target as HTMLFormElement;

    // HACK: reset the validation errors on form re-submission, so focus can be set on highest level validation error in onInvalidCapture()
    setValidationErrors(null);
    if (formElement.checkValidity()) {
      try {
        const formData = {
          email: formElement.email.value,
          password: formElement.password.value,
        };
        const res = await signIn("credentials-login", {
          redirect: false,
          callbackUrl: "/",
          ...formData,
        });

        if (res?.error || res?.ok === false) {
          setSubmissionError(res.error || "Something went wrong");
        }
      } catch (e) {
        console.warn(e);
      }
    }
    setIsSubmitting(false);
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
          placeholder="email@email.com"
          validationErrors={validationErrors}
          required
          minLength={3}
          maxLength={15}
        />
        <Input
          name="password"
          label="Password"
          type="password"
          placeholder="******"
          validationErrors={validationErrors}
          required
          minLength={3}
          maxLength={15}
        />
        <button
          disabled={isSubmitting}
          aria-label="Sign Up"
          type="submit"
          className="my-6 rounded-md border-2 border-transparent bg-sky-600  py-2 text-white transition-all hover:border-sky-600 hover:bg-transparent hover:text-sky-600 disabled:opacity-60 disabled:hover:cursor-not-allowed">
          <p className="text-md flex justify-center font-bold">
            {isSubmitting ? <Loader /> : "Sign In"}
          </p>
        </button>
        {submissionError && (
          <p className="mt-4 text-center text-xl font-bold text-pink-500">
            {submissionError}
          </p>
        )}
      </form>
    </div>
  );
};
