import type { MetadataRoute } from 'next'

const APP_URL = 'https://tarjuman.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: APP_URL,                      lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${APP_URL}/universities`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${APP_URL}/apply`,           lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${APP_URL}/pricing`,         lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${APP_URL}/about`,           lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${APP_URL}/faq`,             lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${APP_URL}/contact`,         lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]
}
