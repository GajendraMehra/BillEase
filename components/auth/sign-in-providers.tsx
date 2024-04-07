"use client";

import React from "react";
import {signIn} from "next-auth/react";
import type {ClientSafeProvider, LiteralUnion} from "next-auth/react";
import type {BuiltInProviderType} from "next-auth/providers/index";
import {Button} from "~/components/ui/button";
import GoogleButton from "react-google-button";
type SignInProvidersProps = {
  providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null;
};

const SignInProviders = ({providers}: SignInProvidersProps) => {
  if (!providers) return null;

  return Object.values(providers).map((provider) => {
    if (provider.name === "Google") {
      return (
        <GoogleButton
          className="w-100 inline-flex shrink-0 items-center justify-center rounded-md"
          key={provider.name}
          type="dark"
          onClick={() => signIn(provider.id)}
        />
      );
    }
    return (
      <Button key={provider.name} variant="primary" onClick={() => signIn(provider.id)}>
        Sign in with {provider.name}
      </Button>
    );
  });
};

export {SignInProviders};
