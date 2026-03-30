function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '')
}

export function getAppUrl(): string {
  const explicit =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    process.env.DEPLOY_URL

  if (!explicit) {
    return 'http://localhost:3000'
  }

  return trimTrailingSlash(explicit)
}
