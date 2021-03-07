import React, { useState } from 'react'
import Chat from '../chat'
import GameInfoBord from '../GameInfoBord';
import GuessContainer from '../GuessContainer'
import TipContainer from '../TipContainer';
import styles from "../../../styles/Room.module.css";

export default function ManagerBord({ room, setMobileMenuOpen }) {
  return (
    <div className={styles["main"]}>
      <GameInfoBord
        setMobileMenuOpen={setMobileMenuOpen}
        currentPlayer={"Você"}
        room={room}
        roomId={room?.id}
      />
      <TipContainer room={room} isFromCurrentPlayer={true} />
      <Chat room={room} roomId={room?.id} />
      <GuessContainer room={room} roomId={room?.id} />
    </div>
  );
}
