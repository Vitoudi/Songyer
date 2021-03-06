import React, { useState } from 'react'
import { useEffect } from 'react';
import { useContext } from 'react';
import { GlobalContext } from '../../context/GlobalContext';
import styles from "../../styles/Room.module.css";

export default function GuessContainer({roomId, room}) {
    const {socket, currentUser} = useContext(GlobalContext)[0]
    const currentPlayer = room?.currentPlayer || {}
    const [guess, setGuess] = useState('')
    const [guesses, setGuesses] = useState([])
    const [gotRigth, setGotRigth] = useState(false)

    useEffect(() => {
        if(!socket) return
        socket.on("new_guess_arrived", (response) => {
          checkForCorrectGuess(response)
        });
    }, [socket])

    useEffect(() => {
      if (!room) return;
      console.log(room)
      if (room?.records?.guesses.length) {

        setGuesses(room.records.guesses);
      }
    }, [room]);

    function handleClick() {
        if(!socket || !room?.songCode || gotRigth || currentPlayer?.id === currentUser.id) return
        socket.emit('new_guess', {roomId, guess, user: currentUser})
        setGuess('')
    }

    function checkForCorrectGuess(guessData) {
        console.log(guessData)
        if(guessData.status !== 'rigth') return

        if(guessData.user.id === currentUser.id) {
            setGotRigth(true)
            console.log('got rigth!')
        }
    }

    return (
      <div className={`${styles["snippet-box"]} ${styles["guess-container"]}`}>
        <h2>Palpites:</h2>

        <div className={styles["msgs-container"]}>
          {guesses.length > 0 &&
            guesses.map((guessData) => {
              return (
                <div
                  className={`${
                    guessData.guess.status === "rigth" ? styles["rigth"] : "no"
                  } ${
                    guessData.guess.status === "close" ? styles["close"] : "no"
                  }`}
                >
                  <p>
                    <span>{guessData.user.username}: </span>{" "}
                    {guessData.guess.guess}
                  </p>
                </div>
              );
            })}
        </div>

        <div
          className={`${styles["send-area"]} ${
            !room?.songCode || gotRigth || currentPlayer?.id === currentUser.id
              ? styles["disable"]
              : ""
          }`}
        >
          <input
            disabled={
              !room?.songCode ||
              gotRigth ||
              currentPlayer?.id === currentUser.id
            }
            placeholder="palpite..."
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleClick()}
            type="text"
            className="input-1"
          />
          <button onClick={handleClick} className="btn-1">
            enviar
          </button>
        </div>
      </div>
    );
}
