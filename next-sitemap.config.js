/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://kanishkanamdeo.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/api/*', '/_next/*', '/404'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/api/', '/_next/'] }
    ],
    additionalSitemaps: [
      'https://kanishkanamdeo.com/rss.xml'
    ],
    // Note: crawlDelay is deprecated and ignored by most crawlers including Google
  },
  transformper: async (config, path) => {
    // Customize priority based on page depth
    let priority = 0.5;
    let changefreq = 'monthly';
    
    if (path === '/') {
      priority = 1.0;
      changefreq = 'weekly';
    } else if (path.includes('#')) {
      priority = 0.7;
      changefreq = 'monthly';
    }
    
    return {
      loc: path,
      changefreq,
      priority,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};
