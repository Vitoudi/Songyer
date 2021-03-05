import React from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { GlobalContext } from '../../../context/GlobalContext'
import styles from '../../../styles/Room.module.css'
import LyricsBord from './LyricsBord'
import ManagerBord from './ManagerBord'
import SongInList from './SongInList'
import loadingIcon from '../../../public/assets/loading-icon.svg'

export default function CurrentPlayerBord({room}) {
    const {socket, currentUser} = useContext(GlobalContext)[0]
    const [searchTerm, setSearchTerm] = useState('')
    const [timeOutForSerach, setTimeOutForSearch] = useState(null)
    const [results, setResults] = useState([])
    const [songData, setSongData] = useState(null)
    const [songTitle, setSongTitle] = useState('')
    const [isLoadingResults, setIsLoadingResults] = useState(false)
    const [isLoadingLyrics, setIsLoadingLyrics] = useState(false);

    useEffect(() => {
        if(!socket) return
        socket.on('results_arrived', results => {
            setIsLoadingResults(false);
            setResults(results)
        })

        socket.on('song_data_arrived', song => {
            setIsLoadingLyrics(false)
            setSongData(data => {
                return {...data, ...song}
            })
        })
    }, [socket])

    function handleChange() {
        if(!searchTerm) return

        if(timeOutForSerach) {
            clearTimeout(timeOutForSerach)
            setTimeOutForSearch(null)
        }

        setTimeOutForSearch(setTimeout(() => {
            setIsLoadingResults(true)
            const formatedTerm = searchTerm.split("-");
            const song = formatedTerm[0];
            const artist = formatedTerm[1] ?? "";

            socket.emit("get_search_results", { song, artist });
            setTimeOutForSearch(null)
        }, 1000))
    }

    if(isLoadingLyrics) {
        return (
          <div style={{display: 'grid', justifyContent: 'center', alignContent: 'center', width: '100%'}}>
            <img className="loading-icon" src={loadingIcon} alt="carregando..." />
          </div>
        );
    }

    if (room.songCode) {
      return <ManagerBord room={room} />;
    }

    if (songData) {
      return <LyricsBord title={songTitle} lyrics={songData.lyrics} />;
    }


    return (
        <div className={styles['current-player-bord-container']}>
            <h1>Encontre uma música:</h1>
            <input placeholder="Ex: hey jude - the beatles" className="input-1" value={searchTerm} onChange={(e) => {
                setSearchTerm(e.target.value)
                handleChange()
            }} type="text"/>

            {(results.length > 0) && <div className={styles['results-container']}>
                {!isLoadingResults? results.map(result => {
                    return (
                        <SongInList setIsLoadingLyrics={setIsLoadingLyrics} setSongTitle={setSongTitle} result={result}/>
                    )
                }) : (
                    <img className={'loading-icon'} src={loadingIcon} alt="carregando..."/>
                )}
            </div>}
        </div>
    )
}
