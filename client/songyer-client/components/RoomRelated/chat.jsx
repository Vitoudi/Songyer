import React, { useEffect } from 'react'
import { useState } from 'react';
import { useRef } from 'react';
import { useContext } from 'react';
import { GlobalContext } from '../../context/GlobalContext';
import styles from '../../styles/Room.module.css'
import ScrollableFeed from 'react-scrollable-feed'

export default function Chat({roomId, room}) {
    //const [room, setRoom] = useState('')
    const {socket, currentUser} = useContext(GlobalContext)[0]
    const currentPlayer = room? room.currentPlayer : {}
    const [msgs, setMsgs] = useState([])
    const [msgText, setMsgText] = useState('')
    const inputRef = useRef(null)

    useEffect(() => {
        if(!socket) return
        //getRoom(roomId)
    }, [socket])

    useEffect(() => {
        if(!socket) return
        socket.on("new_chat_msg_arrived", (msgData) => {
          setMsgs(msgs => [...msgs, msgData])
        });

        /*socket.on('room_arrived', room => {
            //setRoom(room)
        })*/


    }, [socket])

    useEffect(()=> {
        if(!room) return
        //console.log(room)
        if(room?.records?.chat.length) {
            setMsgs(room.records.chat);
        }
    }, [room])

    function handleClick() {
        if (!socket || !msgText) return;

        const input = inputRef.current
        input.focus()
        setMsgText('')
        socket.emit('new_chat_msg', {msgText, currentUser, roomId})
    }

    function getRoom(roomId) {
      socket.emit("get_room", roomId);
    }

    return (
      <div className={`${styles["chat-container"]} ${styles["snippet-box"]}`}>
        <h2>Chat:</h2>
        <div className={styles["msgs-container"]}>
          <ScrollableFeed>
            <div ref={inputRef} className={styles["msgs-container"]}>
              {msgs.length > 0 &&
                msgs.map((msg) => {
                  const isCurrentUser = msg.user.id === currentUser.id;
                  return (
                    <div
                      className={`${styles["msg"]} ${
                        isCurrentUser ? styles["msg-current-user"] : ""
                      }`}
                    >
                      {!isCurrentUser && <h4>{msg.user.username}: </h4>}
                      <span>{msg.msgText}</span>
                    </div>
                  );
                })}
            </div>
          </ScrollableFeed>
        </div>
        <div
          className={`${styles["send-area"]} ${
            currentPlayer?.id === currentUser.id ? styles["disable"] : ""
          }`}
        >
          <input
            disabled={currentPlayer?.id === currentUser.id}
            ref={inputRef}
            placeholder="mensagem..."
            value={msgText}
            onChange={(e) => setMsgText(e.target.value)}
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
