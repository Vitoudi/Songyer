import React, { useContext, useEffect } from 'react'
import { GlobalContext } from '../context/GlobalContext';
import {useRouter} from 'next/router'
import styles from '../styles/Home.module.css'
import { useState } from 'react';



export default function RoomInList({room, username, setWarningMsg, setModalState}) {
    const [globalState, setGlobalState] = useContext(GlobalContext);
    const { socket, currentUser } = globalState;
    const router = useRouter()
    const [requestMade, setRquestMade] = useState(false)

    useEffect(() => {
        if(!socket || !requestMade) return

        socket.on("user_created", (user) => {
            socket.emit("enter_room", { roomId: room.id, user });

          setGlobalState((state) => {
            return {
              ...state,
              currentUser: { ...state.currentUser, id: user.id, username, currentRoom: room.id },
            };
          });
        });

    

        socket.on("user_enter_room", user => {
          router.push("/room/" + room.id);
        });
        
    }, [socket, requestMade])

    function handleClick() {
        
        if (!username) {
            setWarningMsg("Você precisa de um nome para entrar em uma sala");
            setModalState(state => {return {...state, isOpen: true}})
          return;
        }

        socket.emit('create_user', {username, roomId: room.id}) 
        setRquestMade(true)
    }

    return (
      <div className={styles["room"]} onClick={handleClick}>
        <h3>{room.name}</h3>
        <span>{room.members.length}</span>
      </div>
    );
}
