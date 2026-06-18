"use client";

import { authClient } from "@/lib/auth-client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";

const signupSchema = z.object({
  email: z.email("Invalid email").trim().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignUpValues = z.infer<typeof signupSchema>;

export default function SignInForm() {
  const [status, setstatus] = useState("");

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignUpValues) => {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL: "/",
      },
      {
        onRequest: () => {
          setstatus("loading");
        },
        onSuccess: () => {
          setstatus("success");
        },
        onError: (ctx) => {
          setstatus("")
          alert(ctx.error.message);
        },
      },
    );
  };

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Sign in to start booking hotels.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input type="text" {...form.register("email")} />
              <FieldError>{form.formState.errors.email?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input type="password" {...form.register("password")} />
              <FieldError>{form.formState.errors.password?.message}</FieldError>
            </Field>
          </FieldGroup>

          <Button type="submit" className="w-full">
            {status === "loading" && (
              <Loader2 className="h-5 w-5 animate-spin" />
            )}
            {status === "success" && <Check className="h-5 w-5" />}
            {status === "" && "SignIn"}
          </Button>
          <p>
            you dont have an account?
            <Link className="text-orange-600 font-bold" href={"/register"}>Click here</Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
