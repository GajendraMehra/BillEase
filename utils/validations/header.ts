import {z} from "zod";

type HeaderSnippetsFormValues = z.infer<typeof headerSnippetsSchema>;

const headerSnippetsSchema = z.object({
  hsnCode: z.string().max(640, "HSN is too long"),
  name: z.string().max(640, "Name is too long"),
  description: z.string().max(640, "Description is too long"),
  gst: z.string()
});

export type {HeaderSnippetsFormValues};

export {headerSnippetsSchema};
