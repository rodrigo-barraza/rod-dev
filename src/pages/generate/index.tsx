import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Txt2ImageComponent from '@/components/Txt2ImageComponent/Txt2ImageComponent'
import style from './index.module.scss'
import RenderApiLibrary from '@/libraries/RenderApiLibrary'
import GuestApiLibrary from '@/libraries/GuestApiLibrary'
import GenerateHeaderComponent from '@/components/GenerateHeaderComponent/GenerateHeaderComponent'
import GalleryComponent from '@/components/GalleryComponent/GalleryComponent'
import PaginationComponent from '@/components/PaginationComponent/PaginationComponent'
import SeoHeadComponent from '@/components/SeoHeadComponent/SeoHeadComponent'
import UtilityLibrary from '@/libraries/UtilityLibrary'
import useGuest from '@/hooks/useGuest'
import type { Meta, Render, Guest } from '@/types/types'

interface GeneratePageProps {
  render: Render;
  randomRenders: Render[];
  meta: Meta;
  guest: Guest;
}

export const getServerSideProps: GetServerSideProps<GeneratePageProps> = async (context: GetServerSidePropsContext) => {
  const { req, query, resolvedUrl } = context

  let returnBody: { props: GeneratePageProps } | { redirect: { permanent: boolean; destination: string } } = {
    props: {
      render: {} as Render,
      randomRenders: [],
      meta: {} as Meta,
      guest: {},
    }
  }
  
  const getRenders = await RenderApiLibrary.getRenders('240')
  const randomRenders = getRenders?.data?.images ?? []
  if ('props' in returnBody) {
    returnBody.props.randomRenders = randomRenders;
  }
  if (query?.id) {
    const getRender = await RenderApiLibrary.getRender(query.id as string)
    if (getRender?.data) {
      if ('props' in returnBody) returnBody.props.render = getRender.data;
    } else {
      const getRandom = await RenderApiLibrary.getRender()
      if ('props' in returnBody) returnBody.props.render = getRandom?.data ?? ({} as Render);
      returnBody = {
        redirect: {
          permanent: false,
          destination: '/generate',
        },
      };
    }
  } else {
    const getRender = await RenderApiLibrary.getRender()
    if ('props' in returnBody) returnBody.props.render = getRender?.data ?? ({} as Render);
  }

  if ('props' in returnBody) {
    returnBody.props.meta = UtilityLibrary.buildPageMeta(resolvedUrl, {
      title: 'Rodrigo Barraza - Text to Image: AI Image Generation',
      description: "Try out Rodrigo Barraza's text-to-image AI image generation realism-model, trained on more than 120,000 images, photographs and captions.",
      keywords: 'generate, text, text to image, text to image generator, text to image ai, ai image, rodrigo barraza',
      image: returnBody.props.render?.image ? returnBody.props.render.image : 'https://assets.rod.dev/rod-dev-generations/2f996be4-b935-42db-9d1e-01effabbc5c6.jpg',
    });

    const ip = UtilityLibrary.getClientIp(req);
    const getGuest = await GuestApiLibrary.getGuest(ip)
    if (getGuest.data) {
      returnBody.props.guest = getGuest.data;
    }
  }

  return returnBody;
}

export default function Playground({ render, randomRenders, meta, guest }: GeneratePageProps) {
  const router = useRouter()
  const [exploreRenders, setExploreRenders] = useState<Render[]>(randomRenders)
  const [renders, setRenders] = useState<Render[]>([])
  const [renderCount, setRenderCount] = useState(0)
  const { guestData, setGuestData, refreshGuest } = useGuest(guest);
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 12

  async function getCount() {
    const count = await RenderApiLibrary.getCount()
    setRenderCount(count.data.count)
  }

  async function getRenders() {
    const result = await RenderApiLibrary.getRenders('1', 'user');
    setRenders(result.data.images);
  }

  async function getRandomRenders() {
    const result = await RenderApiLibrary.getRenders('24');
    setExploreRenders(result.data.images);
  }

  useEffect(() => {
    refreshGuest()
    getCount()
    getRenders()
  }, [render])

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const filteredCurrentRenders = exploreRenders;
  const filteredCurrentRendersList = filteredCurrentRenders?.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <main className={style.GeneratePage}>
        <SeoHeadComponent meta={meta} />
        
        <GenerateHeaderComponent guest={guestData} renders={renders} />
        <Txt2ImageComponent render={render} setGuest={setGuestData}/>
        <div className="gallery">
          <div className="sectionTitle">
            <div>Explore {renderCount} Renders</div>
          </div>

          <PaginationComponent 
          postsPerPage={postsPerPage} 
          totalPosts={filteredCurrentRenders?.length ?? 0} 
          paginate={paginate} 
          currentPage={currentPage}/>
          <GalleryComponent renders={filteredCurrentRendersList ?? []} mode='grid' />
        </div>
    </main>
  )
}
