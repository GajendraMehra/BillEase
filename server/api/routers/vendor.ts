import {z} from "zod";
import type {Vendors as PrismaProjectItem} from "@prisma/client";
import {createTRPCRouter, protectedProcedure, publicProcedure} from "~/server/api/trpc";
import type {FileObj} from "~/utils/file";
import {projectItemSchema} from "~/utils/validations/project";

type ProjectItem = Omit<PrismaProjectItem, "coverImage" | "image"> & {
  coverImage: FileObj;
  image: FileObj;
};

const S3_DIRECTORY_NAME = "projects";

// prettier-ignore
export const vendorRouter = createTRPCRouter({
  getItems: publicProcedure
    .query(async ({ctx}) => {
      const items = await ctx.prisma.vendors.findMany();
      return items;
    }),

  getItem: publicProcedure
    .input(z.object({id: z.string()}))
    .query(async ({ctx, input: {id}}) => {
      const item = await ctx.prisma.vendors.findUnique({
        where: {id}
      });
      return item;
    }),

  createItem: protectedProcedure
    .input(projectItemSchema)
    .mutation(async ({ctx, input: {...input}}) => {
      console.log({input});
      console.log(ctx.prisma);
      
      return await ctx.prisma.vendors.create({
        data: {
          ...input
        }
      });
    }),

  updateItem: protectedProcedure
    .input(projectItemSchema)
    .mutation(async ({ctx, input: {id, ...input}}) => {

      return await ctx.prisma.$transaction(async (tx) => {
        const item = await ctx.prisma.vendors.findUnique({
          where: {id}
        });

        if (!item) {
          throw new Error("Item not found");
        }
        return await tx.vendors.update({
          where: {id},
          data: {
            ...input,
          }
        });
      });
    }),

  deleteItem: protectedProcedure
    .input(z.object({id: z.string()}))
    .mutation(async ({ctx, input: {id}}) => {
      return await ctx.prisma.$transaction(async (tx) => {
        const item = await tx.vendors.delete({
          where: {id}
        });

        return item;
      });
    })
});

export type {ProjectItem};
