"use client";

import React from "react";
import {FormProvider, useForm} from "react-hook-form";
import {useRouter} from "next/navigation";
import {zodResolver} from "@hookform/resolvers/zod";
import {api} from "~/trpc/react";
import {Button} from "~/components/ui/button";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import {Input} from "~/components/ui/input";
import {useToast} from "~/hooks/use-toast";
import {cn} from "~/utils/className";
import {capitalize} from "~/utils/capitalize";
import {socialMediaIconsDef} from "~/utils/get-social-media-icon";
import type {SocialMediaLinkFormValues} from "~/utils/validations/social-media";
import {socialMediaLinkSchema} from "~/utils/validations/social-media";

type SocialMediaItemFormProps = {
  id: string;
};

const SocialMediaItemForm = ({id}: SocialMediaItemFormProps) => {
  const router = useRouter();
  const {toast} = useToast();
  const utils = api.useUtils();

  const {data} = api.socialMedia.getItem.useQuery({id});
  const createItemMutation = api.socialMedia.createItem.useMutation();
  const updateItemMutation = api.socialMedia.updateItem.useMutation();

  const formMethods = useForm<SocialMediaLinkFormValues>({
    defaultValues: {
      icon: undefined,
      url: ""
    },
    values: data ?? undefined,
    resolver: zodResolver(socialMediaLinkSchema)
  });

  const {control, handleSubmit} = formMethods;

  async function handleFormSubmit(formValues: SocialMediaLinkFormValues, e?: React.BaseSyntheticEvent) {
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

        await utils.socialMedia.getItem.invalidate();
      }
    });

    router.push("/dashboard/social-media");
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={(e) => handleSubmit(handleFormSubmit)(e)}>
        <FormField
          control={control}
          name="icon"
          render={({field: {value, onChange}}) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <ul className="flex flex-wrap gap-2">
                {Object.entries(socialMediaIconsDef).map(([key, Icon]) => (
                  <li key={key} value={key}>
                    <Button
                      size="icon"
                      variant="outline"
                      className={cn({"bg-muted": key === value})}
                      onClick={() => onChange(key)}>
                      <Icon className="h-4 w-4 fill-foreground" aria-hidden="true" />
                      <span className="sr-only">{capitalize(key)}</span>
                    </Button>
                  </li>
                ))}
              </ul>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="url"
          render={({field}) => (
            <FormItem>
              <FormLabel>Url</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter Company Profile url" />
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

export {socialMediaIconsDef, SocialMediaItemForm};
