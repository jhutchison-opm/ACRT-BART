type RelativePath = `/${string}`

export const getUrl = (path: RelativePath) => {
  const newPath = (import.meta.env.BASE_URL + path).replace(/\/+/g, '/')
  const basePath = new URL(newPath, "https://x")

  return basePath.pathname
}
