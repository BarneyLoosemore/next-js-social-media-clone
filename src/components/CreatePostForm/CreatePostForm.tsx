import { useSession } from "next-auth/react";
import Image from "next/future/image";
import React, {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useRef,
  useState,
} from "react";

// 4mb
const IMAGE_UPLOAD_LIMIT = 4194304;

type ValidationErrors = {
  [key: string]: string;
} | null;

export const CreatePostForm: React.FC = () => {
  const { data: sessionData } = useSession();
  const [previewImageFile, setPreviewImageFile] = useState<File | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] =
    useState<ValidationErrors>(null);
  const [successText, setSuccessText] = useState<string | null>(null);

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
      const postText = formElement.postText.value;
      const postImage = formElement.postImage.files[0];
      if (!postText && !postImage) {
        return setSubmissionError("Please enter text and/or upload an image!");
      }

      const formData = new FormData();
      formData.append("text", postText);
      formData.append("image", postImage);

      // If a user is logged in, the post will be associated with their account
      // If not, it will be an anonymous post
      const userId = sessionData?.user?.id;
      if (userId) {
        formData.append("authorId", userId);
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.status !== 200) {
        return setSubmissionError("Error uploading post :(");
      }

      setSubmissionError(null);
      setPreviewImageFile(null);
      formElement.reset();
      setSuccessText("Successfully uploaded post!");
    }
  };

  return (
    <div className="flex flex-col items-center p-5">
      <form
        encType="multipart/form-data"
        className="my-6 flex w-full max-w-sm flex-col outline-4 outline-black"
        onSubmit={handleSubmit}
        onInvalidCapture={handleValidationErrors}
        noValidate>
        <TextAreaInput validationErrors={validationErrors} />
        <FileInput
          previewImageFile={previewImageFile}
          setPreviewImageFile={setPreviewImageFile}
        />
        <button
          aria-label="Sign Up"
          type="submit"
          className=" my-6 rounded-md border-2  border-transparent bg-sky-600 py-2 text-white transition-all hover:border-sky-600 hover:bg-transparent hover:text-sky-600">
          <p className="text-md font-bold ">Post</p>
        </button>
        {submissionError && (
          <p className="mt-4 text-center text-xl font-bold text-pink-500">
            {submissionError}
          </p>
        )}
        {successText && (
          <p className="mt-4 text-center text-xl font-bold text-green-500">
            {successText}
          </p>
        )}
      </form>
    </div>
  );
};

const TextAreaInput: React.FC<{ validationErrors: ValidationErrors }> = ({
  validationErrors,
}) => (
  <div className="relative my-3">
    <textarea
      id="postText"
      name="postText"
      placeholder="Text"
      className={`peer mt-1  w-full rounded-md border border-slate-300 bg-white px-3 py-2 placeholder-transparent focus:outline-none focus:ring-4 focus:ring-sky-600 ${
        validationErrors?.postText
          ? "border-b-4 border-pink-500 valid:border valid:border-slate-300"
          : ""
      }`}
    />
    <label
      htmlFor="postText"
      className="absolute left-1 -top-5 text-sm text-slate-400 transition-all hover:cursor-text peer-placeholder-shown:top-2 peer-placeholder-shown:left-4 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-8 peer-focus:left-1 peer-focus:-top-5 peer-focus:w-8 peer-focus:overflow-hidden peer-focus:whitespace-nowrap peer-focus:text-sm peer-focus:text-white">
      Text
    </label>
    {validationErrors?.postText ? (
      <p className="mt-1 ml-1 h-4 text-sm text-pink-500 peer-valid:hidden">
        {validationErrors.postText}
      </p>
    ) : null}
  </div>
);

const FileInput = ({
  previewImageFile,
  setPreviewImageFile,
}: {
  previewImageFile: File | null;
  setPreviewImageFile: Dispatch<SetStateAction<File | null>>;
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > IMAGE_UPLOAD_LIMIT) {
      return setValidationError("Image must be less than 4MB");
    }
    setPreviewImageFile(file);
  };

  const handleRemovePreviewFile = () => {
    setPreviewImageFile(null);
    if (fileInputRef.current?.value) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <label htmlFor="postImage" className="pl-1 pb-1 text-sm text-white">
        Upload file
      </label>
      <div className="flex justify-evenly rounded-md  border border-gray-700 bg-gray-800 px-6 py-6">
        {previewImageFile && (
          <div>
            <p className="text-white">{previewImageFile.name}</p>
            <button
              aria-label="Remove image file"
              className="relative left-[90%] top-8 flex h-[20px] w-[20px] items-center rounded-full bg-white transition-all hover:opacity-70"
              onClick={handleRemovePreviewFile}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 40 40"
                className="h-[25px] w-[25px]">
                <path d="M20 2.5C10.3 2.5 2.5 10.3 2.5 20c0 9.7 7.8 17.5 17.5 17.5S37.5 29.7 37.5 20C37.5 10.3 29.7 2.5 20 2.5zM24.2 27.7L20 23.5l-4.2 4.2c-1.1 1.1-2.5 1.1-3.5 0-1.1-1.1-1.1-2.4 0-3.5l4.2-4.2-4.2-4.2c-1.1-1.1-1.1-2.5 0-3.5 1.1-1.1 2.4-1.1 3.5 0l4.2 4.2 4.2-4.2c1.1-1.1 2.5-1.1 3.5 0 1.1 1.1 1.1 2.4 0 3.5L23.5 20l4.2 4.2c1.1 1.1 1.1 2.5 0 3.5C26.7 28.8 25.3 28.8 24.2 27.7z"></path>
              </svg>
            </button>
            <Image
              alt="Image file preview"
              src={URL.createObjectURL(previewImageFile)}
              className="aspect-square rounded-md object-cover"
            />
          </div>
        )}
        <input
          ref={fileInputRef}
          aria-label="Upload image file"
          id="postImage"
          name="postImage"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className={`w-[140px] text-transparent file:rounded-md file:border-none file:bg-white file:px-6 file:py-2 file:text-lg file:font-medium file:text-black file:transition-all file:hover:cursor-pointer file:hover:opacity-70 md:w-[125px] md:file:py-1 md:file:px-4 ${
            previewImageFile && "hidden"
          }`}
        />
      </div>
      {validationError && (
        <p className="m-auto mt-4 h-4 text-sm text-pink-500 peer-valid:hidden">
          {validationError}
        </p>
      )}
    </>
  );
};
