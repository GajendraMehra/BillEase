import React from "react";
import type {Metadata} from "next";
import {PageHeader} from "~/components/dashboard/layouts/page-header";
import {PageContent} from "~/components/dashboard/layouts/page-content";
import pkg from "~/package.json";
import {ItemList} from "~/components/dashboard/lists/item-list";

export const metadata: Metadata = {
  title: "Dashboard: Header qq"
};

export default function Page() {
  return (
    <>
      <PageHeader heading={pkg.displayName} description={pkg.tag} />
      <PageContent>
        <>
          <ItemList />
        </>
      </PageContent>
    </>
  );
}
