import React from 'react'
import { useContext } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { GlobalContext } from '../../context/GlobalContext';
import styles from "../../styles/Room.module.css";
import menuIcon from "../../public/assets/menu-icon.png";

export default function GameInfoBord({ currentPlayer, room, setMobileMenuOpen }) {
  const { socket } = useContext(GlobalContext)[0];
  const [currentSongCode, setCurrentSongCode] = useState("");
  const [timerValueInSeconds, setTimerValueInSeconds] = useState(0);
  const [timerString, setTimerString] = useState("");

  useEffect(() => {
    if (!socket) return;

    socket.on("song_code_arrived", (songCode) => {
      //setCurrentSongCode(songCode)
    });

    socket.on("timer_update", (timerValue) => {
      if (timerValue === 0) setCurrentSongCode("");
      setTimerValueInSeconds(timerValue);
    });
  }, []);

  useEffect(() => {
    console.log(room);
    if (!room) return;

    setCurrentSongCode(room.songCode);
  }, [room]);

  useEffect(() => {
    const timerStringValue = formatTimeValue(timerValueInSeconds);
    setTimerString(timerStringValue);
  }, [timerValueInSeconds]);

  function formatTimeValue(value) {
    function secondsToMinutes(value) {
      return value / 60;
    }

    const rawMinutes = secondsToMinutes(value);
    const minutes = Math.floor(rawMinutes).toString();
    const seconds = Math.ceil((rawMinutes - minutes) * 60).toString();

    const output = `${minutes} : ${seconds.padStart(2, "0")}`;

    return output;
  }

  return (
    <div className={styles["game-bord-container"]}>
      <div className={styles["game-info-start"]}>
        <div>
          <div style={{ display: "flex" }}>
            <img
              onClick={() => {
                console.log(setMobileMenuOpen)
                if(setMobileMenuOpen) setMobileMenuOpen(true);
              }}
              className={styles["menu-icon"]}
              style={{ width: "20px", marginRight: "10px" }}
              src={menuIcon}
              alt=""
            />
            <h3>Jogador atual:</h3>
          </div>

          {currentPlayer && (
            <h2 style={{ color: "rgba(255, 255, 255, 0.9)" }}>
              {currentPlayer?.username || currentPlayer}
            </h2>
          )}
        </div>
        <h3 className={styles["timer"]}>{timerString}</h3>
      </div>
      {currentSongCode ? (
        <div className={styles["main-song-code-container"]}>
          <div>
            <p>Código:</p>
            <span>{currentSongCode}</span>
          </div>
        </div>
      ) : (
        <div className={styles["main-song-code-container"]}>
          <div>Esperando jogador...</div>
        </div>
      )}
    </div>
  );
}
