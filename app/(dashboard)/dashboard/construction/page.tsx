import React from "react";
import type {Metadata} from "next";
import {PageHeader} from "~/components/dashboard/layouts/page-header";
import {PageContent} from "~/components/dashboard/layouts/page-content";
// import {SocialMediaList} from "~/components/dashboard/lists/social-media-list";

export const metadata: Metadata = {
  title: "Page Under construction"
};

export default function Page() {
  return (
    <>
      <PageHeader heading="Under construction" description="Page Under construction" />
      <PageContent>
        <h4>Page Under construction</h4>
      </PageContent>
    </>
  );
}
