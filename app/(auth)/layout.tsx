import React from "react";
import type {Metadata} from "next";
import {redirect} from "next/navigation";
import {getServerAuthSession} from "~/server/auth";
import "~/styles/globals.css";
import {Toaster} from "~/components/ui/toast";

export const metadata: Metadata = {
  title: "Dashboard: Authentication",
  description: "Simple, user-friendly interface for portfolio management"
};

export default async function SignInLayout({children}: {children: React.ReactNode}) {
  const session = await getServerAuthSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex flex min-h-full flex-grow flex-col place-content-center">
      <div className="max-w-screen- mx-auto w-10/12   p-4 md:p-6 2xl:p-10">
        {children}
        <Toaster />
        {/* <footer className="mt-3 flex flex-col items-center">
          <span className="text-xs text-muted-foreground opacity-50">Dashboard v{pkg.version}</span>
        </footer> */}
      </div>
    </main>
  );
}
