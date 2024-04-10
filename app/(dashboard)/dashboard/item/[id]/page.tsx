import React from "react";
import type {Metadata} from "next";
import {PageHeader} from "~/components/dashboard/layouts/page-header";
import {PageContent} from "~/components/dashboard/layouts/page-content";
import {HeaderForm} from "~/components/dashboard/forms/header-form";
import pkg from "~/package.json";

export const metadata: Metadata = {
  title: "Dashboard: Items"
};

type PageProps = {
  params: {
    id: string;
  };
};

export default function Page({params: {id}}: PageProps) {
  return (
    <>
      <PageHeader heading={pkg.displayName} description={pkg.tag} />
      <PageContent>
        <HeaderForm id={id} />
      </PageContent>
    </>
  );
}
