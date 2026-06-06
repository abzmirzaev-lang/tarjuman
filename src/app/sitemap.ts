import type { MetadataRoute } from 'next'

const APP_URL = 'https://tarjumanedu.com'
const now = new Date()

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Core
    { url: APP_URL,                                     lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${APP_URL}/apply`,                          lastModified: now, changeFrequency: 'monthly', priority: 0.95 },
    // Universities — high SEO value
    { url: `${APP_URL}/universities`,                   lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${APP_URL}/universities/al-qasimia`,        lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    // Commercial
    { url: `${APP_URL}/pricing`,                        lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    // Informational
    { url: `${APP_URL}/about`,                          lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${APP_URL}/faq`,                            lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${APP_URL}/contact`,                        lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    // Review page
    { url: `${APP_URL}/review`,                         lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    // Legal — low priority
    { url: `${APP_URL}/terms`,                          lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${APP_URL}/privacy`,                        lastModified: now, changeFrequency: 'yearly',  prio