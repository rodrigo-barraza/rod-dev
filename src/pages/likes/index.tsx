import React from 'react'
import { useState, useEffect } from 'react'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import style from './index.module.scss'
import RenderApiLibrary from '@/libraries/RenderApiLibrary'
import GenerateHeaderComponent from '@/components/GenerateHeaderComponent/GenerateHeaderComponent'
import PaginationComponent from '@/components/PaginationComponent/PaginationComponent'
import GalleryComponent from '@/components/GalleryComponent/GalleryComponent'
import FilterComponent from '@/components/FilterComponent/FilterComponent'
import SeoHeadComponent from '@/components/SeoHeadComponent/SeoHeadComponent'
import UtilityLibrary from '@/libraries/UtilityLibrary'
import GuestApiLibrary from '@/libraries/GuestApiLibrary'
import useFilteredPagination from '@/hooks/useFilteredPagination'
import useGuest from '@/hooks/useGuest'
import type { Meta, Render, Guest } from '@/types/types'

interface LikesPageProps {
  meta: Meta;
  guest: Guest;
}

export const getServerSideProps: GetServerSideProps<LikesPageProps> = async (context: GetServerSidePropsContext) => {
  const { req, resolvedUrl } = context

  const meta = UtilityLibrary.buildPageMeta(resolvedUrl, {
    title: 'Rodrigo Barraza - Your Liked AI Art',
    description: 'Browse your liked AI-generated images from Rodrigo Barraza\'s text-to-image generation tool.',
    keywords: 'generate, text, text to image, text to image generator, text to image ai, ai image, rodrigo barraza',
    image: 'https://assets.rod.dev/rod-dev-generations/f377bd59-49d6-4858-91df-3c0a6456c5e2.jpg',
  });

  const ip = UtilityLibrary.getClientIp(req);
  const getGuest = await GuestApiLibrary.getGuest(ip)
  const guest: Guest = getGuest.data || {};

  return { props: { meta, guest } };
}

export default function Likes({ meta, guest }: LikesPageProps) {
  const router = useRouter()
  const [likedRenders, setLikedRenders] = useState<Render[]>([])
  const [currentRenders, setCurrentRenders] = useState<Render[]>([])
  const { guestData, refreshGuest } = useGuest(guest);

  const {
    search, setSearch,
    filter, setFilter,
    sort, setSort,
    galleryMode, setGalleryMode,
    currentPage, postsPerPage,
    filteredItems: filteredCurrentRenders,
    paginatedItems: filteredCurrentRendersList,
    paginate,
  } = useFilteredPagination(likedRenders);

  async function getRenders() {
    const result = await RenderApiLibrary.getRenders('12', 'user')
    setCurrentRenders(result.data.images)
  }

  useEffect(() => {
    getRenders()
  }, [])

  async function getLikedRenders() {
    const result = await RenderApiLibrary.getLikedRenders()
    setLikedRenders(result.data.images)
    if (!result.data.images.length) {
      UtilityLibrary.navigateToGeneration(router)
    }
  }

  useEffect(() => {
    getLikedRenders();
  }, [])

  return (
    <main className={style.RendersPage}>
      <SeoHeadComponent meta={meta} />
      
      <GenerateHeaderComponent guest={guestData} renders={currentRenders} />
        <div className="gallery">
          <div className="details">
              <div className="container column">
                  <h1>Your Likes</h1>
                  <p>text-to-image AI generations</p>
                  <p>A collection of liked AI-generated images</p>
              </div>
          </div>
          
          <FilterComponent setSearch={setSearch} setFilter={setFilter} setSort={setSort} setGalleryMode={setGalleryMode} search={search} filter={filter} sort={sort}/>
          <PaginationComponent 
          postsPerPage={postsPerPage} 
          totalPosts={filteredCurrentRenders?.length ?? 0} 
          paginate={paginate} 
          currentPage={currentPage}/>
          <GalleryComponent renders={filteredCurrentRendersList ?? []} getRenders={getLikedRenders} getGuest={refreshGuest} mode={galleryMode as 'grid' | 'list'} />
          <PaginationComponent postsPerPage={postsPerPage} totalPosts={filteredCurrentRenders?.length ?? 0} paginate={paginate} currentPage={currentPage}/>
        </div>
    </main>
  )
}
