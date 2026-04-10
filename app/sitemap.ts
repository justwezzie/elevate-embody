import type { MetadataRoute } from 'next'
import { getAppUrl } from '@/lib/app-url'
import { getSitemapSessions } from '@/lib/public-sessions'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = getAppUrl()
  const sessions = await getSitemapSessions()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: appUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${appUrl}/sessions`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  const sessionRoutes: MetadataRoute.Sitemap = sessions.map((session) => ({
    url: `${appUrl}/sessions/${session.id}`,
    lastModified: session.updated_at,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...sessionRoutes]
}
