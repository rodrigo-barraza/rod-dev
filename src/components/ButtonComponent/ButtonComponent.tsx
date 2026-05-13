import React from 'react'
import style from './ButtonComponent.module.scss'
import ActiveLinkComponent from '@/components/ActiveLinkComponent'
import UtilityLibrary from '@/libraries/UtilityLibrary'
import { useState, useEffect } from 'react'

export default function ButtonComponent(props: any) {
    const [getLogo, setLogo] = useState('')
    const {label, type, className, disabled, onClick, icon, href, routeHref, logo}: {label: string, type: string, className: string, disabled: boolean, onClick: any, icon: string, href:string, routeHref:string, logo:string} = props

    let buttonType = type === 'button' ? 'button' : type === 'submit' ? 'submit' : 'button';

    let combinedClassNames;
    if (className) {
        combinedClassNames = className.split(' ').map((name) => style[name]).join(' ');
    }

    useEffect(() => {
        setLogo(UtilityLibrary.getIconUrl(logo))
    }, [logo])

    return (
        <div className={`${style.ButtonComponent} ${combinedClassNames} ${type ? style[type] : ''} ${icon ? style[icon] : ''} ${logo ? style.logo : ''} ${logo ? style[logo] : ''}`} disabled={disabled} onClick={onClick}>
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
