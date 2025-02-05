import {z} from "zod";

import {createTRPCRouter, protectedProcedure, publicProcedure} from "~/server/api/trpc";
import {snippetSchema} from "~/utils/validations/snippet";

// prettier-ignore
export const snippetRouter = createTRPCRouter({
  getSnippets: publicProcedure.query(async ({ctx}) => {
    return await ctx.prisma.snippet.findMany({});
  }),
  getItem: protectedProcedure.input(z.object({id: z.string()})).query(async ({ctx, input: {id}}) => {
    return await ctx.prisma.snippet.findUnique({
      where: {id},
    });
  }),
  createSnippet: protectedProcedure.input(snippetSchema).mutation(async ({ctx, input}) => {
    return await ctx.prisma.snippet.create({
      data: input
    });
  }),

  updateSnippet: protectedProcedure.input(snippetSchema.partial()).mutation(async ({ctx, input: {id, ...input}}) => {
    return await ctx.prisma.snippet.update({
      where: {id},
      data: input
    });
  }),

  deleteSnippet: protectedProcedure.input(z.object({id: z.string()})).mutation(async ({ctx, input: {id}}) => {
    return await ctx.prisma.snippet.delete({
      where: {id}
    });
  })
});
