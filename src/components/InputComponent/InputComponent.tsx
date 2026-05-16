import React from 'react'
import style from './InputComponent.module.scss'
import type { InputComponentProps } from '@/types/types'

export default function InputComponent({ label, type, value, onChange }: InputComponentProps) {
    return (
    <div className={style.InputComponent}>
        <label>{label}</label>
        <input value={value} type={type} onChange={event => onChange(event.target.value)}></input>
    </div>
    )
}
