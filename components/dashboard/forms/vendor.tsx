"use client";

import React from "react";
import {FormProvider, useForm} from "react-hook-form";
import {FileX2Icon} from "lucide-react";
import {useRouter} from "next/navigation";
import {zodResolver} from "@hookform/resolvers/zod";
import {api} from "~/trpc/react";
import {useToast} from "~/hooks/use-toast";
import {Button} from "~/components/ui/button";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import {Input} from "~/components/ui/input";
import {Textarea} from "~/components/ui/textarea";
import {Dropzone} from "~/components/ui/dropzone";
import {ImageCard} from "~/components/ui/image-card";
import type {ProjectItemFormValues} from "~/utils/validations/project";
import {projectItemSchema} from "~/utils/validations/project";
import {acceptedImageTypes} from "~/utils/file";

type ProjectItemFormProps = {
  id: string;
};

const ProjectItemForm = ({id}: ProjectItemFormProps) => {
  const router = useRouter();
  const {toast} = useToast();
  const utils = api.useUtils();

  const {data} = api.vendor.getItem.useQuery({id});
  const createItemMutation = api.vendor.createItem.useMutation();
  const updateItemMutation = api.vendor.updateItem.useMutation();

  const formMethods = useForm<ProjectItemFormValues>({
    defaultValues: {
      name: "",
      address: "",
      description: "",
      websiteUrl: "",
      repositoryUrl: ""
    },
    values: data
      ? {
          ...data,
          address: data.address ?? "",
          websiteUrl: data.websiteUrl ?? "",
          repositoryUrl: data.repositoryUrl ?? ""
        }
      : undefined,
    resolver: zodResolver(projectItemSchema)
  });

  const {control, handleSubmit} = formMethods;

  async function handleFormSubmit(formValues: ProjectItemFormValues, e?: React.BaseSyntheticEvent) {
    e?.preventDefault();

    const mutation = data?.id ? updateItemMutation : createItemMutation;
    const mutationVariables = data?.id ? {id: data.id, ...formValues} : formValues;

    await mutation.mutateAsync(mutationVariables, {
      async onSuccess() {
        toast({
          title: "Success",
          description: data?.id ? "Your changes have been saved." : "A new item has been added.",
          variant: "success"
        });

        await utils.vendor.getItem.invalidate();
      }
    });

    router.push("/dashboard/vendor");
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={(e) => handleSubmit(handleFormSubmit)(e)} encType="multipart/form-data">
        <FormField
          control={control}
          name="name"
          render={({field}) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Project name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="address"
          render={({field}) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value ?? ""} placeholder="Enter item description here" />
              </FormControl>
              <FormMessage />
              {/* <FormDescription>If not provided, a description will be used instead.</FormDescription> */}
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
                <Textarea {...field} placeholder="Enter item description here" />
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

export {ProjectItemForm};
