import Head from 'next/head';

interface SeoMeta {
    title?: string;
    description?: string;
    keywords?: string;
    url?: string;
    type?: string;
    image?: string;
    date?: string;
    createdAt?: string;
    jsonLd?: Record<string, unknown>;
}

interface SeoHeadProps {
    meta: SeoMeta;
}

export default function SeoHeadComponent({ meta }: SeoHeadProps) {
    return (
        <Head>
            <title>{meta.title}</title>
            <meta name="description" content={meta.description} />
            <meta name="keywords" content={meta.keywords} />
            <meta name="author" content="Rodrigo Barraza" />
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            {meta.url && (
                <link rel="canonical" href={meta.url} />
            )}
            <meta property="og:url" content={meta.url} />
            <meta property="og:type" content={meta.type} />
            <meta property="og:site_name" content="Rodrigo Barraza" />
            <meta property="og:description" content={meta.description} />
            <meta property="og:title" content={meta.title} />
            {meta.image && (
                <meta property="og:image" content={meta.image} />
            )}
            {(meta.date || meta.createdAt) && (
                <meta property="article:published_time" content={meta.date || meta.createdAt} />
            )}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={meta.title} />
            <meta name="twitter:description" content={meta.description} />
            <meta name="twitter:site" content="@rawdreygo" />
            <meta name="twitter:url" content={meta.url} />
            <meta name="twitter:image" content={meta.image} />
            <link rel="icon" href="/images/favicon.ico" />
            {meta.jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(meta.jsonLd) }}
                />
            )}
        </Head>
    );
}
