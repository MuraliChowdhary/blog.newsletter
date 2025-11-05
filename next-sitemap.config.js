/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://blog.nextdevs.me",
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 0.8,
  sitemapSize: 5000,
  // exclude: ['/api/*', '/admin/*'], 
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
};