import React, { FormEvent, InputHTMLAttributes, useState } from "react";
import { trpc } from "utils/trpc";

type ValidationErrors = {
  username?: string;
  password?: string;
} | null;

type InputProps = {
  name: "username" | "password";
  label: string;
  validationErrors: ValidationErrors;
} & InputHTMLAttributes<any>;

const Input: React.FC<InputProps> = ({
  name,
  label,
  validationErrors,
  ...rest
}) => (
  <>
    <label htmlFor={name}>{label}</label>
    <input
      id={name}
      name={name}
      {...rest}
      className={`
        mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 placeholder-slate-400  shadow-sm focus:outline-none focus:ring-4 focus:ring-sky-600
        ${
          validationErrors?.[name] &&
          "border-b-4 border-pink-600 valid:border valid:border-slate-300"
        }
      `}
      required
      autoFocus
    />
    {validationErrors?.[name] && (
      <p className="mt-2 text-sm text-pink-600">{validationErrors[name]}</p>
    )}
  </>
);

export const SignUpForm = () => {
  const [validationErrors, setValidationErrors] =
    useState<ValidationErrors>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const { mutate: createUser } = trpc.useMutation(["createUser"], {
    onError: (error) => {
      console.warn(error);
    },
    onSettled: (res) => {
      if (res?.userAlreadyExistsError) {
        setSubmissionError("User already exists");
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
        name: formElement.username.value,
        password: formElement.password.value,
      };

      await createUser(formData);
    }
  };

  return (
    <div className="bg-slate-600 p-5">
      <form
        className="m-10 flex flex-col outline-4 outline-black"
        onSubmit={handleSubmit}
        onInvalidCapture={handleValidationErrors}
        noValidate>
        <Input
          name="username"
          label="Username"
          type="text"
          placeholder="Saul Goodman"
          validationErrors={validationErrors}
        />
        <Input
          name="password"
          label="Password"
          type="password"
          placeholder="******"
          validationErrors={validationErrors}
        />
        {submissionError && (
          <p className="mt-2 text-sm text-pink-600">{submissionError}</p>
        )}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
