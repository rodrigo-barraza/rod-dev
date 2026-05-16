import React from 'react'
import style from './ButtonComponent.module.scss'
import ActiveLinkComponent from '@/components/ActiveLinkComponent'
import UtilityLibrary from '@/libraries/UtilityLibrary'
import { useState, useEffect } from 'react'
import type { ButtonComponentProps } from '@/types/types'

export default function ButtonComponent({ label, type, className, disabled, onClick, icon, href, routeHref, logo }: ButtonComponentProps) {
    const [getLogo, setLogo] = useState('')

    const buttonType: 'button' | 'submit' = type === 'submit' ? 'submit' : 'button';

    let combinedClassNames: string | undefined;
    if (className) {
        combinedClassNames = className.split(' ').map((name) => style[name]).join(' ');
    }

    useEffect(() => {
        if (logo) setLogo(UtilityLibrary.getIconUrl(logo))
    }, [logo])

    return (
        <div className={`${style.ButtonComponent} ${combinedClassNames || ''} ${type ? style[type] : ''} ${icon ? style[icon] : ''} ${logo ? style.logo : ''} ${logo ? style[logo] : ''}`} onClick={onClick}>
            { !href && !routeHref && (
                <button type={buttonType} disabled={disabled}>
                    { icon && ( <span className={style.icon}>{icon}</span> )}
                    { label && ( <span className={style.label}>{label}</span> )}
                </button>
            )}
            { href && !routeHref && (
                <a href={href} target="_blank" rel="noopener noreferrer">
                    { logo && ( <img src={getLogo} className={style.logo} alt={icon}></img> )}
                    { icon && ( <span className={style.icon}>{icon}</span> )}
                    { label && ( <span className={style.label}>{label}</span> )}
                </a>
            )}
            { routeHref && !href && (
                <ActiveLinkComponent activeClassName="active" href={routeHref}>
                    { logo && ( <img src={getLogo} className={style.logo} alt={icon}></img> )}
                    { icon && ( <span className={style.icon}>{icon}</span> )}
                    { label && ( <span className={style.label}>{label}</span> )}
                </ActiveLinkComponent>
            )}
        </div>
    )
}
