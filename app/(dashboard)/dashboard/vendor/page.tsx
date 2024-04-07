import React from "react";
import type {Metadata} from "next";
import {PageHeader} from "~/components/dashboard/layouts/page-header";
import {PageContent} from "~/components/dashboard/layouts/page-content";
import {ProjectList} from "~/components/dashboard/lists/project-list";

export const metadata: Metadata = {
  title: "Dashboard: Vendors"
};

export default function Page() {
  return (
    <>
      <PageHeader heading="Vendors" description="All Vendors" />
      <PageContent>
        <ProjectList />
      </PageContent>
    </>
  );
}