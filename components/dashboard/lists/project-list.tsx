"use client";

import React, {useState} from "react";
import Link from "next/link";
import {PlusIcon, PencilIcon, TrashIcon} from "lucide-react";
import type {ProjectItem} from "~/server/api/routers/vendor";
import {api} from "~/trpc/react";
import {useToast} from "~/hooks/use-toast";
import {Button} from "~/components/ui/button";
import {Heading} from "~/components/ui/heading";
import {EmptySection} from "~/components/ui/empty-section";
import {Dialog, DialogTrigger} from "~/components/ui/dialog";
import {DeleteEntityDialog} from "~/components/dashboard/dialogs/delete-entity-dialog";

const ProjectList = () => {
  const {data: vendors = [], isLoading} = api.vendor.getItems.useQuery();
  const deleteItemMutation = api.vendor.deleteItem.useMutation();
  const {toast} = useToast();
  const utils = api.useUtils();

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const selectedItem = vendors.find((item) => item.id === selectedItemId);

  async function handleDeleteItem() {
    if (!selectedItemId) return;

    await deleteItemMutation.mutateAsync(
      {id: selectedItemId},
      {
        async onSuccess() {
          toast({
            title: "Success",
            description: "Vendor deleted successfully",
            variant: "success"
          });

          await utils.vendor.getItems.invalidate();
        }
      }
    );
  }

  function handleDialogOpenChange(open: boolean) {
    if (!open) {
      setSelectedItemId(null);
    }
  }

  function displayItems() {
    return vendors.map((item) => (
      <ProjectCard key={item.id} onClickDeleteBtn={() => setSelectedItemId(item.id)} {...item} />
    ));
  }

  return (
    <Dialog onOpenChange={handleDialogOpenChange}>
      <Heading as="h2" size="sm">
        Vendors
      </Heading>

      <div className="flex flex-col items-start">
        {isLoading ? null : vendors.length ? displayItems() : <EmptySection heading="No Vendors found" />}

        <Button className="mt-6" asChild>
          <Link href="/dashboard/vendor/new">
            <PlusIcon size={16} className="mr-1" />
            Add New Vendor
          </Link>
        </Button>
      </div>

      <DeleteEntityDialog
        title="Delete Vendor"
        entityName={(selectedItem?.name || "Vendor").toLowerCase()}
        onClickDeleteBtn={() => handleDeleteItem()}
      />
    </Dialog>
  );
};

type ProjectCardProps = ProjectItem & {
  onClickDeleteBtn: (e: React.MouseEvent) => void;
};

const ProjectCard = ({id, name, description, onClickDeleteBtn}: ProjectCardProps) => {
  const MAX_TEXT_LENGTH = 100;
  const descriptionLength = description?.length || description?.length;
  const itemDescription = (description || description).slice(0, MAX_TEXT_LENGTH);

  return (
    <article className="flex w-full items-center gap-1 border-b-[1px] border-solid border-muted py-3 last-of-type:border-0">
      <div className="flex flex-1 flex-col items-start">
        <p className="mr-2 font-poppins text-sm font-semibold leading-6">{name}</p>
        <p className="hidden text-xs leading-6 text-muted-foreground sm:block">
          {itemDescription}
          {descriptionLength > MAX_TEXT_LENGTH && "..."}
        </p>
      </div>

      <Button variant="ghost" size="icon" asChild>
        <Link href={`/dashboard/vendor/${id}`}>
          <PencilIcon size={16} />
          <span className="sr-only">Edit</span>
        </Link>
      </Button>

      {/* <Button variant="ghost" size="icon" asChild>
        <Link href={`/dashboard/vendor/${id}`} target="_blank">
          <EyeIcon size={16} />
          <span className="sr-only">Show preview</span>
        </Link>
      </Button> */}

      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" onClick={onClickDeleteBtn}>
          <TrashIcon size={16} />
          <span className="sr-only">Delete</span>
        </Button>
      </DialogTrigger>
    </article>
  );
};

export {ProjectList};
