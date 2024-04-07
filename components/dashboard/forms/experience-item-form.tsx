"use client";

import React, {useEffect} from "react";
import {FormProvider, useFieldArray, useForm} from "react-hook-form";
import {useRouter} from "next/navigation";
import {format} from "date-fns";
import {CalendarIcon, PlusIcon} from "lucide-react";
import {zodResolver} from "@hookform/resolvers/zod";
import {api} from "~/trpc/react";
import {useToast} from "~/hooks/use-toast";
import {Button} from "~/components/ui/button";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import {Input} from "~/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "~/components/ui/popover";
import {Calendar} from "~/components/ui/calendar";
import type {ExperienceItemFormValues} from "~/utils/validations/experience";
import {experienceItemSchema} from "~/utils/validations/experience";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/select";
import {capitalize} from "~/utils/capitalize";

type ExperienceItemFormProps = {
  id: string;
};

const ExperienceItemForm = ({id}: ExperienceItemFormProps) => {
  const router = useRouter();
  const {toast} = useToast();
  const utils = api.useUtils();
  const newResponsibilityItem = {id: undefined, name: ""};

  const {data} = api.experience.getItem.useQuery({id});
  const createItemMutation = api.experience.createItem.useMutation();
  const updateItemMutation = api.experience.updateItem.useMutation();
  const {responsibilities = []} = data || {};

  const formMethods = useForm<ExperienceItemFormValues>({
    defaultValues: {
      company: "",
      position: "",
      startDate: undefined,
      endDate: undefined,
      responsibilities: [newResponsibilityItem]
    },
    values: data ? {...data, responsibilities: [newResponsibilityItem]} : undefined,
    resolver: zodResolver(experienceItemSchema)
  });

  const {control, handleSubmit, watch} = formMethods;
  const startDate = watch("startDate");

  const {fields, append, remove, replace} = useFieldArray({
    control,
    name: "responsibilities"
  });

  // Pass initial values to form
  useEffect(() => {
    if (responsibilities.length) {
      replace(responsibilities);
    }
  }, [responsibilities, replace]);
  const {data: vendors = []} = api.vendor.getItems.useQuery();

  async function handleFormSubmit(
    {responsibilities: formResponsibilities, ...formValues}: ExperienceItemFormValues,
    e?: React.BaseSyntheticEvent
  ) {
    e?.preventDefault();

    // Filter out empty responsibilities
    const responsibilities = formResponsibilities.filter(({name}) => !!name);

    const mutation = data?.id ? updateItemMutation : createItemMutation;
    const mutationVariables = data?.id
      ? {id: data.id, ...formValues, responsibilities}
      : {...formValues, responsibilities};

    await mutation.mutateAsync(mutationVariables, {
      async onSuccess() {
        toast({
          title: "Success",
          description: data?.id ? "Your changes have been saved." : "A new item has been added.",
          variant: "success"
        });

        await utils.experience.getItem.invalidate();
      }
    });

    router.push("/dashboard/invoice");
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={(e) => handleSubmit(handleFormSubmit)(e)}>
        <FormField
          control={control}
          name="position"
          render={({field}) => (
            <FormItem>
              <FormLabel>Bill To</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Eg. Project Director" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex sm:gap-4">
          <FormField
            control={control}
            name="company"
            render={({field: {name, value, onChange}}) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <Select name={name} value={value} onValueChange={(newVal) => (newVal ? onChange(newVal) : undefined)}>
                  <FormControl withDescription>
                    <SelectTrigger className="w-[14rem]">
                      <SelectValue placeholder="Select Company..." />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.name}>
                        {capitalize(vendor.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="startDate"
            render={({field: {value, onChange}}) => (
              <FormItem className="max-w-[14rem] flex-1">
                <FormLabel>Bill Date</FormLabel>

                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className="w-full font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span className="flex-1">{value ? format(value, "LLL dd, y") : "Pick Date"}</span>
                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                  <FormMessage />
                  <PopoverContent className="w-auto p-0" align="start" side="bottom">
                    <Calendar
                      initialFocus
                      captionLayout="dropdown"
                      mode="single"
                      defaultMonth={value || undefined}
                      selected={value || undefined}
                      onSelect={(date) => onChange(date)}
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
          {/* <FormField
          control={control}
          name="company"
          render={({field: {name, value, onChange}}) => (
            <FormItem className="max-w-[14rem] flex-1">
              <FormLabel>Company name</FormLabel>
              <Select name={name} value={value} onValueChange={(newVal) => (newVal ? onChange(newVal) : undefined)}>
                <FormControl withDescription>
                  <SelectTrigger className="w-[14rem]">
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                </FormControl>

                <SelectContent className="mr-2 h-4 w-4">
                  {[{id: "nie"}].map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {capitalize(vendor.id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        /> */}

          {/* <FormField
            control={control}
            name="endDate"
            render={({field: {value, onChange}}) => (
              <FormItem className="max-w-[14rem] flex-1">
                <FormLabel isOptional>To</FormLabel>

                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className="w-full font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span className="flex-1">{value ? format(value, "LLL dd, y") : "Pick end date"}</span>
                      </Button>
                    </FormControl>
                  </PopoverTrigger>

                  <FormMessage />
                  <PopoverContent className="w-auto p-0" align="start" side="bottom">
                    <Calendar
                      initialFocus
                      captionLayout="dropdown"
                      mode="single"
                      defaultMonth={value || undefined}
                      selected={value || undefined}
                      onSelect={(date) => onChange(date)}
                      disabled={{before: startDate ? new Date(startDate) : new Date()}}
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          /> */}
        </div>

        <FormItem>
          <FormLabel isOptional>Supplies Details</FormLabel>
          <FormDescription className="pb-3 pt-0">Add the supplies which you have delivered</FormDescription>

          {fields.map(({id}, idx) => (
            <div key={id} className="flex">
              <FormField
                control={control}
                name={`responsibilities.${idx}.name`}
                render={({field}) => (
                  <FormItem className="py-2">
                    <div className="flex items-center">
                      <FormLabel className="sr-only">Description</FormLabel>
                      <FormControl className="mr-2">
                        <Input {...field} placeholder="Description" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={control}
                name={`responsibilities.${idx}.hsncode`}
                render={({field}) => (
                  <FormItem className="py-2">
                    <div className="flex items-center">
                      <FormLabel className="sr-only">HSN Code</FormLabel>
                      <FormControl className="mr-2">
                        <Input {...field} placeholder="HSN Code" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`responsibilities.${idx}.unitprice`}
                render={({field}) => (
                  <FormItem className="py-2">
                    <div className="flex items-center">
                      <FormLabel className="sr-only">Unit Price</FormLabel>
                      <FormControl className="mr-2">
                        <Input {...field} placeholder="Enter unit price here" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`responsibilities.${idx}.qty`}
                render={({field}) => (
                  <FormItem className="py-2">
                    <div className="flex items-center">
                      <FormLabel className="sr-only">Qty</FormLabel>
                      <FormControl className="mr-2">
                        <Input {...field} placeholder="Enter qty  here" />
                      </FormControl>
                      <Button variant="ghost" size="icon" onClick={() => remove(idx)}>
                        <Trash2Icon size={16} />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>
          ))}

          <Button variant="secondary" className="mt-2" onClick={() => append(newResponsibilityItem)}>
            <PlusIcon size={16} className="mr-1" />
            Add
          </Button>
        </FormItem>

        <Button type="submit" className="mt-6">
          Save changes
        </Button>
      </form>
    </FormProvider>
  );
};

export {ExperienceItemForm};
