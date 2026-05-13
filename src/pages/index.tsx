import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import lodash from 'lodash'
import styles from './index.module.scss'
import ArtCollectionsCollection from '@/collections/ArtCollectionsCollection'
import UtilityLibrary from '@/libraries/UtilityLibrary'
import RenderApiLibrary from '@/libraries/RenderApiLibrary'
import SeoHeadComponent from '@/components/SeoHeadComponent/SeoHeadComponent'

export const getServerSideProps = async (context: any) =>
    UtilityLibrary.buildServerSideMetaProps(context, {
        title: 'Rodrigo Barraza: Photographer, Software Engineer, Artist',
        description: 'Visual portfolio of Rodrigo Barraza, a Vancouver-based photographer, software engineer and generative AI artist. Featuring photography, AI art, film, and animation collections.',
        keywords: 'rodrigo barraza, photographer, software engineer, artist, vancouver, generative ai art, clip guided diffusion, film photography, medium format photography, ai artist, portfolio, emily carr university',
        image: 'https://assets.rod.dev/rod-dev-assets/collections/dreamwork/rodrigo-barraza-dreamwork-beach-medium-format-fuji-velvia-100.jpg',
        jsonLd: {
            '@context': 'https://schema.org',
            '@graph': [
                {
                    '@type': 'WebSite',
                    '@id': 'https://rod.dev/#website',
                    url: 'https://rod.dev/',
                    name: 'Rodrigo Barraza',
                    description: 'Visual portfolio of Rodrigo Barraza, a Vancouver-based photographer, software engineer and artist.',
                },
                {
                    '@type': 'Person',
                    '@id': 'https://rod.dev/#person',
                    name: 'Rodrigo Barraza',
                    givenName: 'Rodrigo',
                    familyName: 'Barraza',
                    url: 'https://rod.dev/',
                    image: 'https://assets.rod.dev/rod-dev-assets/images/rodrigo-barraza-black-and-white-portrait.jpg',
                    jobTitle: ['Photographer', 'Software Engineer', 'Artist'],
                    alumniOf: {
                        '@type': 'CollegeOrUniversity',
                        name: 'Emily Carr University of Art + Design',
                    },
                    address: {
                        '@type': 'PostalAddress',
                        addressLocality: 'Vancouver',
                        addressRegion: 'BC',
                        addressCountry: 'CA',
                    },
                    sameAs: [
                        'https://github.com/rodrigo-barraza',
                        'https://www.instagram.com/rawdreygo',
                        'https://www.linkedin.com/in/rodrigobarraza',
                        'https://www.deviantart.com/bioviral',
                        'https://www.facebook.com/barraza.rodrigo',
                        'https://flickr.com/photos/rodrigobarraza',
                        'https://www.behance.net/rodrigobarraza',
                    ],
                },
            ],
        },
    });

    

export default function Index(props) {
    const { meta } = props
    const [shuffledArtCollection, setShuffledArtCollection] = useState([])

    useEffect(() => {
        async function getRender() {
            const collection = lodash.shuffle(ArtCollectionsCollection);
            setShuffledArtCollection(collection)
        }
        getRender()
    }, [])

    return (
    <main className={styles.home}>
        <SeoHeadComponent meta={meta} />
        <div className="container" itemProp="creator" itemScope itemType="http://schema.org/Person">
            <h1>
                <span className="full-name"><span itemProp="givenName">Rodrigo</span> <span itemProp="familyName">Barraza</span></span>: <span itemProp="jobTitle">photographer</span>, <span itemProp="jobTitle">software engineer</span>, <span itemProp="jobTitle">artist</span>.
            </h1>
        </div>
        <div className="gallery">
            {shuffledArtCollection.map((artCollection, artCollectionIndex) => (
                <div className="image-container" key={artCollectionIndex}>
                    { artCollection.prompt && (
                        <Link 
                        className="image" 
                        href={`/generate?id=${artCollection.id}`}>
                            <div className="the-image">
                                <Image 
                                    src={artCollection.image}
                                    alt={artCollection.prompt}
                                    fill={true}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                <div className="inside-description">
                                    <div className="name" itemProp="name">Generate</div>
                                    <div className="year" itemProp="dateCreated">2023</div>
                                </div>
                            </div>
                        </Link>
                    )}
                    { artCollection.path && (
                        <Link 
                        className="image" 
                        href={`/collections/${artCollection.path}`}
                        onMouseOver={(event) => UtilityLibrary.playVideoOnMouseOver(event)}
                        onMouseLeave={(event) => UtilityLibrary.stopVideoOnMouseOver(event)}>
                            <div className="the-image">
                                { !artCollection.works[0].videoPath && artCollection.thumbnail && (
                                    <Image 
                                    src={UtilityLibrary.renderAssetPath(artCollection.thumbnail, artCollection.path)}
                                    alt={artCollection.description}
                                    fill={true}/>
                                )}
                                { !artCollection.works[0].videoPath && !artCollection.thumbnail && (
                                    <Image 
                                    src={UtilityLibrary.renderAssetPath(artCollection.works[0].imagePath, artCollection.path)}
                                    alt={artCollection.description}
                                    fill={true}/>
                                )}
                                { artCollection.works[0].videoPath && (
                                    <video muted loop itemProp="video"
                                    poster={artCollection.poster ? UtilityLibrary.renderAssetPath(artCollection.poster, artCollection.path) : ''}>
                                        <source src={UtilityLibrary.renderAssetPath(artCollection.works[0].videoPath, artCollection.path)} type="video/mp4"/>
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                                <div className="inside-description">
                                    <div className="name" itemProp="name">{artCollection.title}</div>
                                    <div className="year" itemProp="dateCreated">{artCollection.year}</div>
                                </div>
                            </div>
                        </Link>

                    )}
                </div>
            ))}
        </div>
    </main>
    )
}