import React, { HTMLInputTypeAttribute } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { z } from "zod";
import Link from "next/link";

export type LoginInputs = {
  email: string;
  password: string;
};

const validationSchema = z.object({
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
  password: z.string().min(1, { message: "Password is required" }),
});

type Props = {
  className?: string;
  callbackUrl?: string;
  error?: string;
};

export default function LoginForm(props: Props) {
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm<LoginInputs>({
    resolver: zodResolver(validationSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
  });
  const { errors, isValid } = formState;

  const onSubmit = async (values: LoginInputs) => {
    try {
      const response = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (!response?.error) {
        router.push(props.callbackUrl ?? "/account");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const renderInput = (
    label: keyof LoginInputs,
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
    <div className={props.className}>
      <h2>Login</h2>
      <p>error .{props.error}.</p>
      {!!props.error && (
        <p className="bg-red-100 text-red-600 text-center p-2">
          Authentication Failed
        </p>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-1/2 max-w-[1080px] flex-col gap-2"
      >
        <div className="flex flex-col max-w-[1080px] gap-9">
          <div className="flex flex-col gap-2">
            {renderInput("email", "Email", "email")}
            {renderInput("password", "Password", "password")}
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant={isValid ? "primary" : "disabled"}
              size="sm"
              disabled={!isValid}
            >
              Login
            </Button>
            <div className="text-center">
              <Link href="/register" className="text-sm hover:underline">
                Switch to Sign Up
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
