import React from 'react'
import Chat from '../chat'
import GameInfoBord from '../GameInfoBord';
import GuessContainer from '../GuessContainer'
import TipContainer from '../TipContainer';
import styles from "../../../styles/Room.module.css";

export default function ManagerBord({room}) {
    return (
      <div className={styles['main']}>
        <GameInfoBord currentPlayer={'Você'} room={room} roomId={room?.id} />
        <TipContainer room={room} isFromCurrentPlayer={true} />
        <Chat room={room} roomId={room?.id} />
        <GuessContainer room={room} roomId={room?.id} />
      </div>
    );
}
