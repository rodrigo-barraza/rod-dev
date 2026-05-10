import React from 'react'
import style from './style.module.scss'
import { useRef } from 'react'

export default function DialogComponent(props: any) {
    const {className, children, show}: {className: string, children: any, show: boolean} = props
    const dialogReference: any = useRef({})
    let combinedClassNames;
    if (className) {
        combinedClassNames = className.split(' ').map((name) => style[name]).join(' ');
    }

    return (
        <>
            {show && (
                <div className={`${style.DialogComponent} ${combinedClassNames}`}>
                        <div className={style.modal}>
                            {children}
                        </div>
                </div>
            )}
        </>
    )
}