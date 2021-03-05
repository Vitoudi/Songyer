import React, { useContext } from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { GlobalContext } from '../../context/GlobalContext';
import styles from "../../styles/Room.module.css";

export default function TipContainer({room, isFromCurrentPlayer}) {
    const { socket, currentUser } = useContext(GlobalContext)[0];
    const [currentTipText, setCurrentTipText] = useState('')
    const [tips, setTips] = useState([])

    useEffect(()=> {
        if(!room) return
        let index = 0
        const tips = room.records.tips.map((tip) => {
          index++;
          return { text: tip, index };
        });
        setTips(tips)
    }, [room])

    useEffect(()=> {
        
        console.log(tips)
    }, [tips])

    function handleClick() {
        if(!currentTipText) return
        socket.emit('new_tip', {roomId: room.id, text: currentTipText})
    }

    return (
      <div className={`${styles["tip-container"]} ${styles["snippet-box"]}`}>
        <h2>Dicas:</h2>
        <div className={styles["msgs-container"]}>
          {tips?.length > 0 &&
            tips.map((tip) => {
              return (
                <p className={styles["tip"]}>
                  <strong>DICA {tip.index}: </strong>
                  {tip.text}
                </p>
              );
            })}
        </div>

        {isFromCurrentPlayer && (
          <div className={styles["send-area"]}>
            <input
              placeholder="mensagem..."
              value={currentTipText}
              onChange={(e) => setCurrentTipText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleClick()}
              type="text"
              className="input-1"
            />
            <button onClick={handleClick} className="btn-1">
              enviar
            </button>
          </div>
        )}
      </div>
    );
}