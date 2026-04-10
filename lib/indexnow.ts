import { getAppUrl } from '@/lib/app-url'

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '')
}

export function getIndexNowKey() {
  return process.env.INDEXNOW_KEY?.trim() || null
}

export function getIndexNowKeyLocation() {
  const key = getIndexNowKey()

  if (!key) {
    return null
  }

  return `${trimTrailingSlash(getAppUrl())}/indexnow-key.txt`
}

export async function submitIndexNowUrls(urls: string[]) {
  const key = getIndexNowKey()
  const keyLocation = getIndexNowKeyLocation()

  if (!key || !keyLocation) {
    return
  }

  const uniqueUrls = Array.from(new Set(urls.filter(Boolean)))

  if (uniqueUrls.length === 0) {
    return
  }

  try {
    await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        host: new URL(getAppUrl()).host,
        key,
        keyLocation,
        urlList: uniqueUrls,
      }),
    })
  } catch (error) {
    console.warn(
      'IndexNow submission failed:',
      error instanceof Error ? error.message : 'Unknown error'
    )
  }
}

export function getSessionIndexNowUrls(sessionId: string) {
  const appUrl = trimTrailingSlash(getAppUrl())

  return [
    appUrl,
    `${appUrl}/sessions`,
    `${appUrl}/sessions/${sessionId}`,
  ]
}
