import {SnippetType} from "@prisma/client";
import {z} from "zod";

const snippetSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z.string(),
  hsnCode: z.string(),
  gst: z.number()
});

export {snippetSchema};
