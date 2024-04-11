"use client";

import React from "react";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {api} from "~/trpc/react";
import {useToast} from "~/hooks/use-toast";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import {Button} from "~/components/ui/button";
import {Textarea} from "~/components/ui/textarea";
import {Heading} from "~/components/ui/heading";
import type {ContactSnippetsFormValues} from "~/utils/validations/contact";
import {contactSnippetsSchema} from "~/utils/validations/contact";

const ContactForm = () => {
  const {toast} = useToast();

  const formMethods = useForm<ContactSnippetsFormValues>({
    defaultValues: {
      description: ""
    },
    values: snippetValues,
    resolver: zodResolver(contactSnippetsSchema)
  });

  const {control, handleSubmit} = formMethods;

  async function handleFormSubmit(snippets: ContactSnippetsFormValues, e?: React.BaseSyntheticEvent) {
    e?.preventDefault();
    await updateSnippets(snippets);

    toast({
      title: "Success",
      description: "Your changes have been saved.",
      variant: "success"
    });
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={(e) => handleSubmit(handleFormSubmit)(e)}>
        <Heading as="h2" size="sm">
          General settings
        </Heading>

        <FormField
          control={control}
          name="description"
          render={({field}) => (
            <FormItem>
              <FormLabel>Compant Name</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter Company Name here" />
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

export {ContactForm};
