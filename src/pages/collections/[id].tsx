import lodash from 'lodash'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import styles from './[id].module.scss'
import UtilityLibrary from '@/libraries/UtilityLibrary'
import ArtCollectionsCollection from '@/collections/ArtCollectionsCollection'
import SeoHeadComponent from '@/components/SeoHeadComponent/SeoHeadComponent'
import type { Meta, ArtCollection, ArtWork } from '@/types/types'

interface CollectionPageProps {
    meta: Meta;
    currentCollectionWorks: ArtWork[];
    currentCollection: ArtCollection;
}

export const getServerSideProps: GetServerSideProps<CollectionPageProps> = async (context: GetServerSidePropsContext) => {
    const { query, resolvedUrl } = context
    
    const currentCollectionPath = query.id as string;
    const currentCollection = ArtCollectionsCollection.find(collection => collection.path === currentCollectionPath)

    if (!currentCollection) {
        return { notFound: true };
    }

    const currentCollectionWorks = currentCollection.works;

    let image: string | null = null;
    if (currentCollection.thumbnail) {
        image = UtilityLibrary.renderAssetPath(currentCollection.thumbnail, currentCollection.path)
    } else if (currentCollection.works[0]?.imagePath) {
        image = UtilityLibrary.renderAssetPath(currentCollection.works[0].imagePath, currentCollection.path)
    } else if (currentCollection.poster) {
        image = UtilityLibrary.renderAssetPath(currentCollection.poster, currentCollection.path)
    }

    // Build image objects for ImageGallery schema
    const imageObjects = currentCollectionWorks
        .filter((work) => work.imagePath)
        .map((work) => ({
            '@type': 'ImageObject',
            name: work.title,
            contentUrl: UtilityLibrary.renderAssetPath(work.imagePath!, currentCollection.path),
            description: work.caption || work.description || `${work.title} by Rodrigo Barraza`,
            creator: { '@type': 'Person', name: 'Rodrigo Barraza' },
            copyrightHolder: { '@type': 'Person', name: 'Rodrigo Barraza' },
            license: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
            ...(work.year ? { dateCreated: String(work.year) } : {}),
        }));

    // Build video objects for VideoObject schema
    const videoObjects = currentCollectionWorks
        .filter((work) => work.videoPath)
        .map((work) => ({
            '@type': 'VideoObject',
            name: work.title,
            contentUrl: UtilityLibrary.renderAssetPath(work.videoPath!, currentCollection.path),
            description: work.description || `${work.title} — AI art animation by Rodrigo Barraza`,
            ...(work.poster ? { thumbnailUrl: UtilityLibrary.renderAssetPath(work.poster, currentCollection.path) } : {}),
            ...(work.duration ? { duration: `PT${work.duration}S` } : {}),
            ...(work.uploadDate ? { uploadDate: work.uploadDate } : {}),
        }));

    // Build the @graph array
    const graphEntries: Record<string, unknown>[] = [
        {
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: 'https://rod.dev/',
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Collections',
                    item: 'https://rod.dev/',
                },
                {
                    '@type': 'ListItem',
                    position: 3,
                    name: currentCollection.title,
                    item: `https://rod.dev/collections/${currentCollection.path}`,
                },
            ],
        },
    ];

    // Add ImageGallery if there are image works
    if (imageObjects.length > 0) {
        graphEntries.push({
            '@type': 'ImageGallery',
            name: `${currentCollection.title} — ${currentCollection.type === 'ai' ? 'AI Art' : currentCollection.type === 'photography' ? 'Photography' : 'Art'} by Rodrigo Barraza`,
            description: currentCollection.description,
            creator: {
                '@type': 'Person',
                name: 'Rodrigo Barraza',
                url: 'https://rod.dev/rodrigo-barraza',
            },
            image: imageObjects,
        });
    }

    // Add VideoObject entries at the graph level
    if (videoObjects.length > 0) {
        graphEntries.push(...videoObjects);
    }

    return {
        props: {
            meta: UtilityLibrary.buildPageMeta(resolvedUrl, {
                title: `${currentCollection.documentTitle}`,
                description: `${currentCollection.documentDescription}`,
                keywords: `${currentCollection.documentKeywords}`,
                image: image ?? undefined,
                jsonLd: {
                    '@context': 'https://schema.org',
                    '@graph': graphEntries,
                },
            }),
            currentCollectionWorks: currentCollectionWorks,
            currentCollection: currentCollection,
        }
    };
}

export default function Collection({ meta, currentCollectionWorks, currentCollection }: CollectionPageProps) {
    const [moreCollections, setMoreCollections] = useState<ArtCollection[]>([])

    useEffect(() => {
        const result = lodash.reject(lodash.shuffle(ArtCollectionsCollection), { name: currentCollection?.title }).slice(0, 3) as ArtCollection[]
        setMoreCollections(result)
    }, [currentCollection?.title])

    return (
        <main className={styles.CollectionView}>
            <SeoHeadComponent meta={meta} />
            <div className="collection">
                <div className="collection-details">
                    <div className="container">
                        <div>
                            <h1>{currentCollection?.title}</h1>
                            <span>{currentCollection?.year}</span>
                        </div>
                        <p>{currentCollection?.medium}</p>
                        <p className="duration">{UtilityLibrary.humanDuration(currentCollection?.duration)}</p>

                        { currentCollection?.ekphrasis && (
                            <p className="ekphrasis">{currentCollection.ekphrasis}</p>
                        )}
                        { currentCollection?.description && (
                            <p className="description" dangerouslySetInnerHTML={{ __html: currentCollection.description}}></p>
                        )}
                    </div>
                </div>

                {currentCollection && currentCollectionWorks && currentCollectionWorks.map((work: ArtWork, workIndex: number) => (
                    <div className={`work ${work?.orientation || currentCollection?.orientation || ''}`} key={workIndex}>
                        <div className="container">
                            { work.imagePath && (
                                <picture>
                                    <img
                                        onClick={(event) => UtilityLibrary.imageFullScreen(event, currentCollection.path, work.imagePath)}
                                        src={UtilityLibrary.renderAssetPath(work?.imagePath, currentCollection?.path)}
                                        alt={work.title}>
                                    </img>
                                </picture>
                            )}

                            { work.videoPath && (
                                <video id="oneVideo" autoPlay muted controls={currentCollection.videoControls} loop poster=""
                                key={work.title}
                                v-if="work.videoPath">
                                    <source src={UtilityLibrary.renderAssetPath(work.videoPath, currentCollection.path)} type="video/mp4"></source>
                                    Your browser does not support the video tag.
                                </video>
                            )}
                            

                            { currentCollectionWorks.length >= 2 && (
                                <div className="card">
                                    <div>
                                        <h2>{work.title}</h2>
                                        <span className="year">{work.year}</span>
                                    </div>
                                    <p>{work.medium}</p>
                                    { work?.duration && (
                                        <p>{UtilityLibrary.humanDuration(work.duration)}</p>
                                    )}
                                    { work?.ekphrasis && (
                                        <p className="ekphrasis">{work.ekphrasis}</p>
                                    )}
                                    { work?.description && (
                                        <p className="info" dangerouslySetInnerHTML={{ __html: work?.description}}></p>
                                    )}
                                </div>
                            ) }
                        </div>
                    </div>
                ))}
            </div>

            <div className="container more-collections">
                <div className="section-title">More collections</div>
                <div className="collections">

                    {moreCollections.map((collection, collectionIndex) => (
                        <div className="collection" key={collectionIndex}>
                            <Link
                            href={`/collections/${collection.path}`}
                            onMouseOver={(event) => UtilityLibrary.playVideoOnMouseOver(event)}
                            onMouseLeave={(event) => UtilityLibrary.stopVideoOnMouseOver(event)}>
                                <div className="image">
                                    {!collection.works[0].videoPath && !collection.imagePath && (
                                        <Image
                                        src={UtilityLibrary.renderAssetPath(collection.works[0].imagePath ?? '', collection.path)}
                                        alt={collection.description || collection.title}
                                        fill={true}>
                                        </Image>
                                    )}
                                    { collection.works[0].videoPath && (
                                        <video muted loop
                                        preload="metadata"
                                        key={collection.title}
                                        poster={collection.poster ? UtilityLibrary.renderAssetPath(collection.poster, collection.path) : ''}>
                                            <source src={UtilityLibrary.renderAssetPath(collection.works[0].videoPath, collection.path)} type="video/mp4"></source>
                                            Your browser does not support the video tag.
                                        </video>
                                    )}
                                    <div className="overlay">
                                        <div className="titl">{collection.title}</div>
                                        <div className="yea">{collection.year}</div>
                                    </div>
                                </div>
                                <div className="description">
                                    <div>
                                        <h2 className="title">{collection.title}</h2>
                                        <span className="year">{collection.year}</span>
                                    </div>
                                    <div>
                                        <span className="medium">{collection.medium}</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </main>
  );
}