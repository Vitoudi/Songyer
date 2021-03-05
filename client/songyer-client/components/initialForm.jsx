import React from 'react'
import styles from '../styles/Home.module.css'

export default function InitialForm({username, setUsername}) {
    function handleChange(e) {
        setUsername(e.target.value)
    }

    return (
        <section className={styles['initial-form-container']}>
            <header className={styles['header']}>
                <h1>Songyer</h1>
            </header>

            <div className={styles['input-container']}>
                <input placeholder="Nome..." type="text" value={username} onChange={handleChange} name="" id=""/>
            </div>
        </section>
    )
}
