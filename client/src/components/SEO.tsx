import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  pathname?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  keywords?: string;
  noindex?: boolean;
  structuredData?: object | object[];
}

export function SEO({
  title,
  description,
  pathname = '',
  image = '/image-cards-sites.jpg?v=2',
  type = 'website',
  keywords = 'Darave Studios, Roblox, Game Development, Game Assets',
  noindex = false,
  structuredData,
}: SEOProps) {
  const siteUrl = 'https://daravestudios.vercel.app';
  const canonicalUrl = pathname ? `${siteUrl}${pathname}` : siteUrl;
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="Darave Studios" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:creator" content="@daravestudios" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(
            Array.isArray(structuredData)
              ? { "@graph": structuredData }
              : structuredData
          )}
        </script>
      )}
    </Helmet>
  );
}

// Structured data generators
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Darave Studios',
    url: 'https://daravestudios.vercel.app',
    logo: 'https://daravestudios.vercel.app/image-google-site.png?v=2',
    description: 'Darave Studios is a leading game development studio specializing in Roblox games, assets, and creative solutions.',
    sameAs: [
      'https://twitter.com/daravestudios',
      'https://discord.gg/74HtzDZX4U',
      'https://www.roblox.com/groups/35946997',
    ],
  };
}

export function generateWebPageSchema(title: string, description: string, pathname: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: `https://daravestudios.vercel.app${pathname}`,
    publisher: {
      '@type': 'Organization',
      name: 'Darave Studios',
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; item: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://daravestudios.vercel.app${item.item}`,
    })),
  };
}
