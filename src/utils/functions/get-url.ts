import { normalize } from 'path'

type RelativePath = `/${string}`

export const getUrl = (relPath: RelativePath) => {
  return normalize(import.meta.env.BASE_URL + relPath)
}