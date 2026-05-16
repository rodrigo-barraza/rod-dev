import React from 'react'
import UtilityLibrary from '@/libraries/UtilityLibrary'
import style from './BadgeComponent.module.scss'
import type { BadgeComponentProps } from '@/types/types'

export default function BadgeComponent({ type, value }: BadgeComponentProps) {
    let label: string | undefined;
    let color: string | undefined;

    if (type === 'sampler') {
        label = UtilityLibrary.findSamplerLabel(value)
    }
    if (type === 'style') {
        label = UtilityLibrary.findStyleLabel(value)
        const foundStyle = UtilityLibrary.findStyle(value)
        if (foundStyle) {
            color = foundStyle.color
        }
    }

    return (
        <>
            {label && (
                <p className={`${style.BadgeComponent} ${color}`} style={{background: color}}>{label}</p>
            )}
        </>
    )
}
