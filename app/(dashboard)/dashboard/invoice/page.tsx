import React from "react";
import type {Metadata} from "next";
import {PageHeader} from "~/components/dashboard/layouts/page-header";
import {PageContent} from "~/components/dashboard/layouts/page-content";
import {ExperienceList} from "~/components/dashboard/lists/experience-list";
import pkg from "~/package.json";

export const metadata: Metadata = {
  title: "Dashboard: Generate Bill"
};

export default function Page() {
  return (
    <>
      <PageHeader heading={pkg.displayName} description={pkg.tag} />
      <PageContent>
        <ExperienceList />
      </PageContent>
    </>
  );
}