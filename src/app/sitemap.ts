import type { MetadataRoute } from 'next'

const APP_URL = 'https://tarjumanedu.com'
const now = new Date()

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: APP_URL,                                     lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${APP_URL}/apply`,                          lastModified: now, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${APP_URL}/universities`,                   lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${APP_URL}/universities/al-qasimia`,        lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${APP_URL}/pricing`,                        lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${APP_URL}/about`,                          lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${APP_URL}/faq`,                            lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${APP_URL}/contact`,                        lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${APP_URL}/review`,                         lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    // SEO landing pages
    { url: `${APP_URL}/postupit-v-saudovskuyu-araviyu`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${APP_URL}/study-in-saudi-arabia`,          lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${APP_URL}/saudiya-arabistoniga-kirish`,    lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${APP_URL}/stipendiya-saudovskaya-araviya`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${APP_URL}/al-qasimia-university-postuplenie`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${APP_URL}/islamskiy-universitet-mediny`,   lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${APP_URL}/distancionnyy-bakalavriat-shariat`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${APP_URL}/albukhary-international-university`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${APP_URL}/polnyy-grant-v-saudovskuyu-araviyu`, lastModified: now, changeFrequency: 'weekly',  priority: 0.95 },
    { url: `${APP_URL}/terms`,                          lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${APP_URL}/privacy`,                        lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${APP_URL}/refund`,                         lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
  ]
}
