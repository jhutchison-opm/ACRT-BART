import { getCollection, type CollectionEntry } from "astro:content";

const testGroups = await getCollection("testCaseGroups");
const sortedTestCaseGroups = testGroups.sort(
  (a, b) => a.data.order - b.data.order,
)

export const getTestCaseGroupsPagination = (slug?: CollectionEntry<'testCaseGroups'>['slug']) => {
  const currIndex = sortedTestCaseGroups.findIndex(stcg => stcg.slug === slug)
  return {
    first: sortedTestCaseGroups[0],
    prev: currIndex !== -1 ? sortedTestCaseGroups[currIndex - 1] : undefined,
    next: currIndex !== -1 ? sortedTestCaseGroups[currIndex + 1] : undefined,
    last: sortedTestCaseGroups[sortedTestCaseGroups.length - 1]
  }
} 