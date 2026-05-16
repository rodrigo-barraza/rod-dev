import React from 'react'
import style from './SelectComponent.module.scss'
import type { SelectComponentProps } from '@/types/types'

export default function SelectComponent({ label, value, options, onChange, disabled }: SelectComponentProps) {
    return (
    <div className={style.SelectComponent}>
        <label>{label}</label>
        <select 
        onChange={event => onChange(event.target.value)}
        value={value}
        disabled={disabled}>
            {options.map((option, index) => (
                <option value={option.value} key={index}>{option.label}</option>
            ))}
        </select>
    </div>
    )
}
