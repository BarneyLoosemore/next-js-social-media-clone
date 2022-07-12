import React, { InputHTMLAttributes } from "react";

type InputProps = {
  name: "username" | "email" | "password" | "postText" | "postImage";
  label: string;
  validationErrors: {
    [key: string]: string;
  } | null;
} & InputHTMLAttributes<any>;

export const Input: React.FC<InputProps> = ({
  name,
  label,
  validationErrors,
  ...rest
}) => (
  <div className="relative my-3">
    <input
      id={name}
      name={name}
      {...rest}
      className={`peer mt-1  w-full rounded-md border border-slate-300 bg-white px-3 py-2 placeholder-transparent focus:outline-none focus:ring-4 focus:ring-sky-600 ${
        validationErrors?.[name]
          ? "border-b-4 border-pink-500 valid:border valid:border-slate-300"
          : ""
      }`}
    />
    <label
      htmlFor={name}
      className="absolute left-1 -top-5 text-sm text-slate-400 transition-all hover:cursor-text peer-placeholder-shown:top-2 peer-placeholder-shown:left-4 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-8 peer-focus:left-1 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-white">
      {label}
    </label>
    {validationErrors?.[name] ? (
      <p className="mt-1 ml-1 h-4 text-sm text-pink-500 peer-valid:hidden">
        {validationErrors[name]}
      </p>
    ) : null}
  </div>
);
