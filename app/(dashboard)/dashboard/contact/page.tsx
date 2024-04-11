import React from "react";
import type {Metadata} from "next";
import {PageHeader} from "~/components/dashboard/layouts/page-header";
import {PageContent} from "~/components/dashboard/layouts/page-content";
import {ContactForm} from "~/components/dashboard/forms/contact-form";
import {ContactList} from "~/components/dashboard/lists/contact-list";
import {Separator} from "~/components/ui/separator";
import pkg from "~/package.json";

export const metadata: Metadata = {
  title: "Dashboard: Contact"
};

export default function Page() {
  return (
    <>
      <PageHeader heading={pkg.displayName} description={pkg.tag} />
      <PageContent>
        <ContactList />
      </PageContent>
    </>
  );
}
