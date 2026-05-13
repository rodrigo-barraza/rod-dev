import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
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

export const getServerSideProps = async (context) => {
  const { req, query, resolvedUrl } = context

  let returnBody = {
    props: {
      render: {},
      randomRenders: {},
      meta: {},
      guest: {},
    }
  }
  
  const getRenders = await RenderApiLibrary.getRenders('240')
  const randomRenders = getRenders?.data?.images ?? []
  returnBody.props.randomRenders = randomRenders;
  if (query?.id) {
    const getRender = await RenderApiLibrary.getRender(query.id)
    if (getRender?.data) {
      returnBody.props.render = getRender.data;
    } else {
      const getRandom = await RenderApiLibrary.getRender()
      returnBody.props.render = getRandom?.data ?? {}
      returnBody = {
        redirect: {
          permanent: false,
          destination: '/generate',
        },
      };
    }
  } else {
    const getRender = await RenderApiLibrary.getRender()
    returnBody.props.render = getRender?.data ?? {};
  }
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

  return returnBody;
}

export default function Playground(props) {
  const { render, randomRenders, meta, guest } = props
  const router = useRouter()
  const [exploreRenders, setExploreRenders] = useState(randomRenders)
  const [renders, setRenders] = useState([])
  const [renderCount, setRenderCount] = useState(0)
  const { guestData, setGuestData, refreshGuest } = useGuest(guest);
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 12

  async function getCount() {
    const count = await RenderApiLibrary.getCount()
    setRenderCount(count.data.count)
  }

  async function getRenders() {
    const getRenders = await RenderApiLibrary.getRenders('1', 'user');
    setRenders(getRenders.data.images);
  }

  async function getRandomRenders() {
    const getRandomRenders = await RenderApiLibrary.getRenders('24');
    setExploreRenders(getRandomRenders.data.images);
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
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
          totalPosts={filteredCurrentRenders?.length} 
          paginate={paginate} 
          currentPage={currentPage}/>
          <GalleryComponent renders={filteredCurrentRendersList} mode='grid' />
        </div>
    </main>
  )
}
