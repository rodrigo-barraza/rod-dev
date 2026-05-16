import React from 'react'
import style from './TextAreaComponent.module.scss'
import type { TextAreaComponentProps } from '@/types/types'

export default function TextAreaComponent({ label, value, onChange, onKeyDown, disabled }: TextAreaComponentProps) {
    return (
    <div className={style.TextAreaComponent}>
        <label>{label}</label>
        <textarea value={value} onChange={event => onChange(event.target.value)} onKeyDown={event => onKeyDown?.(event)} disabled={disabled}></textarea>
    </div>
    )
}
