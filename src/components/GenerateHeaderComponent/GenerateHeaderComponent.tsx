import React from 'react'
import styles from './GenerateHeaderComponent.module.scss'
import ButtonComponent from '@/components/ButtonComponent/ButtonComponent'
import type { GenerateHeaderComponentProps } from '@/types/types'

const GenerateHeaderComponent: React.FC<GenerateHeaderComponentProps> = ({ guest, renders }) => {
    return (
        <div className={styles.GenerateHeaderComponent}>
          <div className={styles.container}>
            <ButtonComponent 
              className="transparent-night"
              label="Generate"
              icon="add_photo_alternate"
              type="button" 
              disabled={!guest?.likes}
              routeHref="generate"
            ></ButtonComponent>
            {/* <ButtonComponent 
              className="transparent-night"
              label="Explore"
              icon="search"
              type="button" 
              routeHref="explore"
              disabled={!guest?.likes}
            ></ButtonComponent> */}
            <ButtonComponent 
              className="transparent-night"
              icon="favorite"
              label={`Liked (${guest?.likes ? guest.likes : '0'})`}
              type="button" 
              routeHref="likes"
              disabled={!guest?.likes}
            ></ButtonComponent>
            <ButtonComponent 
              className="transparent-night"
              icon="photo_library"
              label={`Images (${renders?.length ? renders.length : '0'})`}
              type="button" 
              routeHref="renders"
              disabled={!renders?.length}
            ></ButtonComponent>
          </div>
        </div>
    )
}

export default GenerateHeaderComponent