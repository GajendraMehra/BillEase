import React from "react";
import type {Metadata} from "next";
import {PageHeader} from "~/components/dashboard/layouts/page-header";
import {PageContent} from "~/components/dashboard/layouts/page-content";
import {ProjectItemForm} from "~/components/dashboard/forms/vendor";

export const metadata: Metadata = {
  title: "Dashboard: Vendors"
};

type PageProps = {
  params: {
    id: string;
  };
};

export default function Page({params: {id}}: PageProps) {
  const isNew = id === "new";
  const heading = isNew ? "Create" : "Edit";
  const description = isNew ? "Create a new vendor." : "Edit an existing vendor.";

  return (
    <>
      <PageHeader heading={"BillEase"} description={description} />
      <PageContent>
        <ProjectItemForm id={id} />
      </PageContent>
    </>
  );
}
