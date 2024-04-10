import React from "react";
import type {Metadata} from "next";
import type {LucideIcon} from "lucide-react";
import {SquareUserRound, BookTextIcon, Building2} from "lucide-react";
import {PageHeader} from "~/components/dashboard/layouts/page-header";
import {PageContent} from "~/components/dashboard/layouts/page-content";
import {Button} from "~/components/ui/button";
import {Heading} from "~/components/ui/heading";
import Link from "next/link";
import pkg from "~/package.json";

const projectLinks: Array<UsefulLinkDef> = [
  {
    id: "github-repo",
    text: "Vendors",
    description: "Manage Your Vendors",
    href: "/dashboard/vendor",
    icon: SquareUserRound
  },
  {
    id: "documentation",
    text: "Invoices",
    description: "View your Invoices",
    href: "/dashboard/invoice",
    icon: BookTextIcon
  },
  {
    id: "releases",
    text: "Company Info",
    description: "View your company info",
    href: "/dashboard/contact",
    icon: Building2
  }
];

export const metadata: Metadata = {
  title: "Dashboard: General"
};

export default function Page() {
  function displayLinks() {
    return projectLinks.map((item) => <LinkCard key={item.id} {...item} />);
  }

  return (
    <>
      <PageHeader heading={pkg.displayName} description={pkg.tag} />
      <PageContent>
        <Heading as="h2" size="sm">
          Introduction
        </Heading>

        <p className="pb-8 text-sm leading-7 text-muted-foreground">
          Welcome to BillEase, the ultimate solution for managing your bills and generating invoices effortlessly. With
          BillEase, you can bid farewell to the chaos of paper bills and the headache of manual invoice creation.
          Whether you are an individual or a business, BillEase has got you covered.
        </p>

        <Heading as="h2" size="sm">
          Quick Access
        </Heading>

        <p className="pb-4 text-sm leading-7 text-muted-foreground">Below are some quick features</p>

        {<ul className="grid gap-3 pt-2 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">{displayLinks()}</ul>}
      </PageContent>
    </>
  );
}

type UsefulLinkDef = {
  id: string;
  text: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

const LinkCard = ({text, description, icon: Icon, href}: UsefulLinkDef) => {
  return (
    <li className="group flex">
      <Button variant="outline" className="h-20 flex-1 justify-start gap-4" asChild>
        <Link href={href} rel="noopener noreferrer">
          <Icon size={24} className="text-foreground transition-colors group-hover:text-primary" />
          <span className="flex flex-col gap-1">
            <span className="text-sm text-foreground">{text}</span>
            <span className="font-sans text-xs font-normal text-muted-foreground">{description}</span>
          </span>
        </Link>
      </Button>
    </li>
  );
};
