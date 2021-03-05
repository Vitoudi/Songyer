import React, { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { GlobalContext } from "../../../context/GlobalContext";
import styles from "../../../styles/Room.module.css";

export default function LyricsBord({ title, lyrics }) {
  const { socket, currentUser } = useContext(GlobalContext)[0];
  const [verses, setVerses] = useState([]);
  const [currentSongCode, setCurrentSongCode] = useState("");

  useEffect(() => {
    const verses = lyrics.split("\n");
    setVerses(verses);
  }, []);

  function getInitialsFromVerse(verse) {
    verse = verse.toUpperCase().replace(/[^\w ]/g, "");
    let regex = new RegExp(/\b(\w)/, "g");
    return verse.match(regex).join(".");
  }

  function handleVerseClick(e) {
    const verse = e.target.textContent;
    if (!verse) return;
    const songCode = getInitialsFromVerse(verse);
    setCurrentSongCode(songCode);
  }

  function handleButtonClick() {
      console.log('title: ', title)
    if (!currentSongCode) return;
    console.log(currentUser);


    socket.emit("new_song_code", {
      songTitle: title,
      songCode: currentSongCode,
      roomId: currentUser.currentRoom,
    });
  }

  return (
    <div className={styles["lyrics-bord-container"]}>
      <h2>Selecione um verso da música:</h2>
      <div className={styles["song-code"]}>
        <span>Seu código: </span>
        {currentSongCode}
      </div>
      <div className={styles["lyrics-container"]}>
        {verses.length > 0 &&
          verses.map((verse) => {
            return (
              <p onClick={handleVerseClick} className={styles["verse"]}>
                {verse.replace(/\[.*\]/, "")}
              </p>
            );
          })}
      </div>
      <button
        onClick={handleButtonClick}
        className={`btn-1 ${styles["next-btn"]} ${
          currentSongCode ? "" : styles["disable"]
        }`}
      >
        Prosseguir &rarr;
      </button>
    </div>
  );
}
