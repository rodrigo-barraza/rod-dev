import styles from './index.module.scss'
import ProjectsCollection from '@/collections/ProjectsCollection'
import SeoHeadComponent from '@/components/SeoHeadComponent/SeoHeadComponent'
import UtilityLibrary from '@/libraries/UtilityLibrary'
import type { Meta } from '@/types/types'

export const getServerSideProps = async (context: { resolvedUrl: string }) =>
    UtilityLibrary.buildServerSideMetaProps(context, {
        title: 'Rodrigo Barraza - Software Engineering Projects',
        description: 'Software engineering projects, open-source repositories, and AI art tools by Rodrigo Barraza. Including Pristine Diffusion, image captioning, and full-stack web applications.',
        keywords: 'rodrigo barraza, projects, repository, image captioning, blip2, github, google colab, disco diffusion, pristine diffusion, programming, software engineer, portfolio, open source, ai art tools, full stack developer',
        image: 'https://assets.rod.dev/rod-dev-assets/collections/dreamwork/rodrigo-barraza-dreamwork-beach-medium-format-fuji-velvia-100.jpg',
        jsonLd: {
            '@context': 'https://schema.org',
            '@graph': [
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
                            name: 'Projects',
                            item: 'https://rod.dev/projects',
                        },
                    ],
                },
                {
                    '@type': 'CollectionPage',
                    name: 'Software Engineering Projects by Rodrigo Barraza',
                    description: 'A portfolio of software engineering projects, open-source tools, and AI art experiments.',
                    url: 'https://rod.dev/projects',
                    creator: {
                        '@type': 'Person',
                        name: 'Rodrigo Barraza',
                        url: 'https://rod.dev/rodrigo-barraza',
                    },
                },
            ],
        },
    });

interface ProjectsPageProps {
    meta: Meta;
}

export default function Projects({ meta }: ProjectsPageProps) {
    return (
        <main className={styles.AboutView}>
            <SeoHeadComponent meta={meta} />
            <div className="container">
            <div className="layout">
                <div className="main">

                    {ProjectsCollection.map((project, projectIndex) => (
                        <div key={projectIndex} className="about">
                            <div className="text">
                                <div className="about-info">
                                    <h2 className="title">{project.title} <span>{project.year}</span></h2>
                                    <p className="source">
                                        {project.link && (<a href={project.link} target="_blank" rel="noopener noreferrer">Preview</a>)}
                                        {project.github && (<a href={project.github} target="_blank" rel="noopener noreferrer">Github</a>)}
                                        {project.googleColab && (<a href={project.googleColab} target="_blank" rel="noopener noreferrer">Google Colab</a>)}
                                    </p>
                                    <p dangerouslySetInnerHTML={{ __html: project.description}}></p>
                                    <div className="languages">
                                        { project.languages.length && project.languages.map((language, languageIndex) => (
                                            <p key={languageIndex}>
                                                { language == 'Python' && (<span>🐍</span>) }
                                                { language == 'Jupyter Notebook' && (<span>🔴</span>) }
                                                { language == 'JavaScript' && (<span>🟨</span>) }
                                                { language == 'TypeScript' && (<span>🟦</span>) }
                                                { language == 'HTML' && (<span>🟧</span>) }
                                                { language == 'CSS' && (<span>🟩</span>) }
                                                { language == 'Solidity' && (<span>🟪</span>)}
                                                { language == 'React' && (<span>⚛️</span>)}
                                                { language == 'Next.js' && (<span>🔺</span>)}
                                                <span className="language">{language}</span>
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            </div>
        </main>
    )
}
