import React, { type ReactNode } from 'react'
import style from './style.module.scss'

interface DialogComponentProps {
    className?: string;
    children: ReactNode;
    show: boolean | string;
}

export default function DialogComponent({ className, children, show }: DialogComponentProps) {
    let combinedClassNames: string | undefined;
    if (className) {
        combinedClassNames = className.split(' ').map((name) => style[name]).join(' ');
    }

    return (
        <>
            {show && (
                <div className={`${style.DialogComponent} ${combinedClassNames || ''}`}>
                        <div className={style.modal}>
                            {children}
                        </div>
                </div>
            )}
        </>
    )
}