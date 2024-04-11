import {z} from "zod";

type HeaderSnippetsFormValues = z.infer<typeof headerSnippetsSchema>;

const headerSnippetsSchema = z.object({
  hsnCode: z.string().regex(/^\d{3,10}$/, "Invalid HSN code format"),
  name: z.string().min(3, "Name must be 3 char long").max(640, "Name is too long"),
  description: z.string().min(3, "Description must be 3 char long").max(640, "Description is too long"),
  gst: z.string().regex(/^(\d{1,2}(\.\d{1,2})?|100(\.0{1,2})?)$/, "Invalid GST percentage")
});

export type {HeaderSnippetsFormValues};

export {headerSnippetsSchema};
