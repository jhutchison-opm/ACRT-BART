export const getUrl = (path: string) => {
  const basePath = new URL(import.meta.env.BASE_URL, "https://x")
  const { pathname: relPath } = new URL(path, basePath)
  return relPath
}