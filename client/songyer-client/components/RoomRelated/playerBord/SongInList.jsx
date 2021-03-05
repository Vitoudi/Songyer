import React, { useContext } from 'react'
import { GlobalContext } from '../../../context/GlobalContext';
import styles from "../../../styles/Room.module.css";

export default function SongInList({result, setSongTitle, setIsLoadingLyrics}) {
    const { socket } = useContext(GlobalContext)[0];

    function handleClick() {
        socket.emit('get_song', result)
        setIsLoadingLyrics(true)
        setSongTitle(result.title)
    }
    return (
      <div className={styles["result"]} onClick={handleClick}>
        <img src={result.albumArt} alt="" />
        <h3>{result.title}</h3>
      </div>
    );
}
