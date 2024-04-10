"use client";

import React from "react";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {api} from "~/trpc/react";
import {useToast} from "~/hooks/use-toast";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";
import {Textarea} from "~/components/ui/textarea";
import {Heading} from "~/components/ui/heading";
import type {HeaderSnippetsFormValues} from "~/utils/validations/header";
import {headerSnippetsSchema} from "~/utils/validations/header";
import {useRouter} from "next/navigation";
type HeaderFormProps = {
  id: string;
};

const HeaderForm = ({id}: HeaderFormProps) => {
  const {toast} = useToast();
  const {data} = api.snippet.getItem.useQuery({id});
  const createItemMutation = api.snippet.createSnippet.useMutation();
  const updateItemMutation = api.snippet.updateSnippet.useMutation();
  const utils = api.useUtils();
  const router = useRouter();

  const formMethods = useForm<HeaderSnippetsFormValues>({
    defaultValues: {
      description: ""
    },
    values: {
      description: data?.description || "",
      gst: data?.gst.toString() || "",
      hsnCode: data?.hsnCode || "",
      name: data?.name || ""
    },
    resolver: zodResolver(headerSnippetsSchema)
  });

  const {control, handleSubmit} = formMethods;

  async function handleFormSubmit({...formValues}: HeaderSnippetsFormValues, e?: React.BaseSyntheticEvent) {
    console.log({formValues});

    e?.preventDefault();
    const mutation = data?.id ? updateItemMutation : createItemMutation;
    const mutationVariables = data?.id ? {id: data.id, ...formValues} : {...formValues};

    await mutation.mutateAsync(
      {...mutationVariables, gst: mutationVariables.gst / 1 || 0},
      {
        async onSuccess() {
          toast({
            title: "Success",
            description: data?.id ? "Your changes have been saved." : "A new item has been added.",
            variant: "success"
          });

          await utils.snippet.getSnippets.invalidate();
        }
      }
    );
    router.push("/dashboard/item");
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={(e) => handleSubmit(handleFormSubmit)(e)} encType="multipart/form-data">
        <Heading as="h2" size="sm">
          New Item
        </Heading>
        <FormField
          control={control}
          name="name"
          render={({field}) => (
            <FormItem>
              <FormLabel>Item Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Web Cameras" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />{" "}
        <FormField
          control={control}
          name="hsnCode"
          render={({field}) => (
            <FormItem>
              <FormLabel>HSN Code</FormLabel>
              <FormControl>
                <Input {...field} placeholder="13023210" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="gst"
          render={({field}) => (
            <FormItem>
              <FormLabel>GST</FormLabel>
              <FormControl>
                <Input type="number" {...field} placeholder="18" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="description"
          render={({field}) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter short header description here" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-6">
          Save changes
        </Button>
      </form>
    </FormProvider>
  );
};

export {HeaderForm};
