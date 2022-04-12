/**
 * @author liuyuan
 * @date 2022-04-10 22:35
 * @since 0.1.0
 */

import React from 'react'
// import classnames from 'classnames'
import style from './style.module.scss'
import logo from './logo.svg'

interface IndexProps {}

const Index: React.FC<IndexProps> = props => {
    return (
        <div className={style.App}>
            <header className={style.AppHeader}>
                <img src={logo} className={style.AppLogo} alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className={style.AppLink}
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer">
                    Learn React
                </a>
            </header>
        </div>
    )
}

export default React.memo(Index)
