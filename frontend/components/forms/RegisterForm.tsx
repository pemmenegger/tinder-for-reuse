import React, { HTMLInputTypeAttribute } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/lib/api/accounts";
import { z } from "zod";
import { useRouter } from "next/router";
import Link from "next/link";

export type RegisterInputs = {
  email: string;
  password: string;
  confirm_password: string;
  display_name: string;
  phone: string;
};

const validationSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .refine(
        (value) =>
          /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value) &&
          value.length <= 50,
        {
          message: "Invalid email address",
        }
      ),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(50, { message: "Password must be less than 50 characters long" }),
    confirm_password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(50, { message: "Password must be less than 50 characters long" }),
    display_name: z
      .string()
      .min(1, { message: "Display name is required" })
      .refine(
        (value) =>
          /^[a-zA-Z0-9- ]*$/.test(value) &&
          value.length <= 60 &&
          value.length >= 2,
        {
          message: "Invalid name",
        }
      ),
    phone: z
      .string()
      .refine((value) => /^[+()\d]*$/.test(value) && value.length <= 20, {
        message: "Only digits are allowed",
      }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export default function RegisterForm() {
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm<RegisterInputs>({
    resolver: zodResolver(validationSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
  });
  const { errors, isValid } = formState;

  const onSubmit = async (values: RegisterInputs) => {
    try {
      console.log(`sent to backend: ${JSON.stringify(values)}`);
      const token = await registerUser(values);
      // TODO store token
      console.log(`token: ${token}`);
      router.push("/account");
    } catch (err) {
      console.log(err);
    }
  };

  const renderInput = (
    label: keyof RegisterInputs,
    placeholder: string,
    type?: HTMLInputTypeAttribute
  ) => {
    const error = errors[label]?.message;
    return (
      <div className={`w-full`}>
        <Input {...register(label)} placeholder={placeholder} type={type} />
        {error && <p className="px-2.5 pt-1.5 text-sm text-red">{error}</p>}
      </div>
    );
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col max-w-[1080px] gap-9">
          <div className="flex flex-row gap-4">
            <div className="w-1/2 flex flex-col gap-2">
              {renderInput("email", "Email*", "email")}
              {renderInput("password", "Password*", "password")}
              {renderInput("confirm_password", "Confirm Password*", "password")}
            </div>
            <p className="w-1/2 text-dgray text-sm">
              We use email and password to authenticate your account. Also, your
              email will be the main way others contact you.
            </p>
          </div>
          <div className="flex flex-row gap-4">
            <div className="w-1/2 flex flex-col gap-2">
              {renderInput("phone", "Phone")}
            </div>
            <p className="w-1/2 text-dgray text-sm">
              If it suits you better, you can additionally provide a phone
              number.
            </p>
          </div>
          <div className="flex flex-row gap-4">
            <div className="w-1/2 flex flex-col gap-2">
              {renderInput("display_name", "Account Name*")}
            </div>
            <p className="w-1/2 text-dgray text-sm">
              Finally, set a display name for your account. This is how other
              users will see you.
            </p>
          </div>
          <div className="flex flex-row gap-4">
            <div className="w-1/2 flex flex-col gap-2">
              <Button
                variant={isValid ? "primary" : "disabled"}
                size="sm"
                disabled={!isValid}
              >
                Register
              </Button>
              <div className="text-center">
                <Link href="/login" className="text-sm hover:underline">
                  Switch to Login
                </Link>
              </div>
            </div>
            <p className="w-1/2 text-dgray text-sm"></p>
          </div>
        </div>
      </form>
    </div>
  );
}
