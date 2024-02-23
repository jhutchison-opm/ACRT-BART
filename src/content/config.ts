import { defineCollection, reference, z } from "astro:content";
// Define a `type` and `schema` for each collection
const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
  })
});

const testCaseGroupsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    order: z.number()
  })
})

export const expectedResultOptions = ["pass", "fail", "dna"] as const

const testCasesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    group: reference('testCaseGroups'),
    id: z.string().min(1),
    description: z.string(),
    link: z.string().url(),
    expectedResult: z.enum(expectedResultOptions)
  })
})
// Export a single `collections` object to register your collection(s)
export const collections = {
  pages: pagesCollection,
  testCases: testCasesCollection,
  testCaseGroups: testCaseGroupsCollection
}; 