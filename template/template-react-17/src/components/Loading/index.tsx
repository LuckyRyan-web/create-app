/**
 * @author huangrongfa
 * @date 2021-05-17 21:13
 * @since 0.0.0
 */

import React from 'react'
//import classnames from 'classnames'
import style from './style.module.scss'

interface LoadingProps {
    width?: string | number
    height?: string | number
}

const Loading: React.FC<LoadingProps> = (props) => {
    const { width = '100%', height = '160px' } = props

    return (
        <div
            className={style.loading}
            style={{
                width,
                height,
            }}
        >
            <div className={style.boxes}>
                <div className={style.box}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className={style.box}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className={style.box}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div className={style.box}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
    )
}

export default React.memo(Loading)
