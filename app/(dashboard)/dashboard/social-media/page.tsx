import React from "react";
import type {Metadata} from "next";
import {PageHeader} from "~/components/dashboard/layouts/page-header";
import {PageContent} from "~/components/dashboard/layouts/page-content";
import {SocialMediaList} from "~/components/dashboard/lists/social-media-list";

export const metadata: Metadata = {
  title: "Dashboard: Company Profile"
};

export default function Page() {
  return (
    <>
      <PageHeader heading="Company Profile" description="Company Profile settings" />
      <PageContent>
        <SocialMediaList />
      </PageContent>
    </>
  );
}
