import React, { useContext } from 'react'
import { GlobalContext } from '../../context/GlobalContext'
import styles from '../../styles/Room.module.css'

export default function UserInRoom({options}) {
    const globalState = useContext(GlobalContext)[0]
    const {currentUser} = globalState
    const {member, currentPlayer} = options

    return (
      <div
        key={member.id}
        className={`${member.id === currentUser.id && styles["current-user"]} ${
          member.id === currentPlayer.id && styles["current-player"]
        } ${styles['user']}`}
      >
        <h3>{member.username}</h3>
            <div style={{marginLeft: 'auto'}}>{member.points}</div>
   
      </div>
    );
}
