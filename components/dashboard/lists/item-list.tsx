"use client";

import React, {useState} from "react";
import type {Snippet} from "@prisma/client";
import Link from "next/link";
import {PlusIcon, PencilIcon, TrashIcon} from "lucide-react";
import {api} from "~/trpc/react";
import {useToast} from "~/hooks/use-toast";
import {Dialog, DialogTrigger} from "~/components/ui/dialog";
import {Button} from "~/components/ui/button";
import {DeleteEntityDialog} from "~/components/dashboard/dialogs/delete-entity-dialog";
import {EmptySection} from "~/components/ui/empty-section";
import {Heading} from "~/components/ui/heading";

const ItemList = () => {
  const {data: items = [], isLoading} = api.snippet.getSnippets.useQuery();

  const deleteItemMutation = api.snippet.deleteSnippet.useMutation();
  const {toast} = useToast();
  const utils = api.useUtils();

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const selectedItem = items.find((item) => item.id === selectedItemId);
  const {name} = selectedItem || {};

  async function handleDeleteItem() {
    if (!selectedItemId) return;

    await deleteItemMutation.mutateAsync(
      {id: selectedItemId},
      {
        async onSuccess() {
          toast({
            title: "Success",
            description: "Item deleted successfully",
            variant: "success"
          });

          await utils.snippet.getSnippets.invalidate();
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
    return items.map((item) => (
      <ItemCard key={item.id} onClickDeleteBtn={() => setSelectedItemId(item.id)} {...item} />
    ));
  }

  return (
    <Dialog onOpenChange={handleDialogOpenChange}>
      <Heading as="h2" size="sm">
        Items
      </Heading>

      <div className="flex flex-col items-start">
        {isLoading ? null : items.length ? displayItems() : <EmptySection heading="No Item found" />}

        <Button className="mt-6" asChild>
          <Link href="/dashboard/item/new">
            <PlusIcon size={16} className="mr-1" />
            Add new Item
          </Link>
        </Button>
      </div>

      <DeleteEntityDialog title="Delete Item" entityName={name} onClickDeleteBtn={() => handleDeleteItem()} />
    </Dialog>
  );
};

type ItemCardProps = Snippet & {
  onClickDeleteBtn: (e: React.MouseEvent) => void;
};

const ItemCard = ({id, name, hsnCode, onClickDeleteBtn}: ItemCardProps) => {
  return (
    <article className="flex w-full items-center gap-1 border-b-[1px] border-solid border-muted py-3 last-of-type:border-0">
      <div className="mr-4 flex-1">
        <p className="font-poppins text-sm font-semibold leading-8">{name}</p>
        {/* <p className="text-xs leading-6 text-muted-foreground">{value}</p> */}
        <span className="text-xs leading-6 text-muted-foreground">
          {hsnCode}
          {/* {endDate ? format(endDate, "MMM yyyy") : "Present"} */}
        </span>
      </div>

      <Button variant="ghost" size="icon" asChild>
        <Link href={`/dashboard/item/${id}`}>
          <PencilIcon size={16} />
          <span className="sr-only">Edit</span>
        </Link>
      </Button>

      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" onClick={onClickDeleteBtn}>
          <TrashIcon size={16} />
          <span className="sr-only">Delete</span>
        </Button>
      </DialogTrigger>
    </article>
  );
};

export {ItemList};
