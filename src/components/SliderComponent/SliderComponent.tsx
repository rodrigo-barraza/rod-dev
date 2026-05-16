import React from 'react'
import { useEffect, useRef } from 'react'
import style from './SliderComponent.module.scss'
import type { SliderComponentProps } from '@/types/types'

export default function SliderComponent({ label, value, onChange, disabled }: SliderComponentProps) {
    const inputReference = useRef<HTMLInputElement>(null)
    
    useEffect(() => {
        const inputElement = inputReference.current
        if (!inputElement) return
        const val = (value - Number(inputElement.min)) / (Number(inputElement.max) - Number(inputElement.min)) * 100
        inputElement.style.background = 'linear-gradient(to right, #2c75fd 0%, #2c75fd ' + val + '%, #d3d3d3 ' + val + '%, #d3d3d3 100%)'
    }, [value])

    return (
        <div className={style.SliderComponent}>
        <label>{label}</label>
            <input 
            ref={inputReference} 
            type="range" 
            min="5" 
            max="9" 
            value={value} 
            onChange={event => onChange(Number(event.target.value))}
            disabled={disabled}/>
        </div>
    )
}
