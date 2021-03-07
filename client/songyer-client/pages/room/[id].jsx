import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import Chat from "../../components/RoomRelated/chat";
import CurrentPlayerBord from "../../components/RoomRelated/playerBord/CurrentPlayerBord";
import GameInfoBord from "../../components/RoomRelated/GameInfoBord";
import GuessContainer from "../../components/RoomRelated/GuessContainer";
import TipContainer from "../../components/RoomRelated/TipContainer";
import UserInRoom from "../../components/RoomRelated/userInRoom";
import { GlobalContext } from "../../context/GlobalContext";
import styles from "../../styles/Room.module.css";
import { updateMembers } from "../../utils/updateMembers";
import menuIcon2 from "../../public/assets/menu-icon-2.png";

export default function RoomPage() {
  const { socket, currentUser } = useContext(GlobalContext)[0];
  const router = useRouter();
  const ROOM_ID = router.asPath.split("ROOM_")[1];
  const [thisRoom, setThisRoom] = useState(null)
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [userIsTheCurrentPlayer, setUserIsTheCurrentPlayer] = useState(false);
  const [members, setMembers] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!socket) return;
    console.log('get_room was called')
    getThisRoom();
    socket.emit('user_is_in_room', 'ROOM_' + ROOM_ID)
  }, [ROOM_ID, socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on("room_recived", (room) => {
      setThisRoom(room);

      socket.on('room_changed', room => {
        setThisRoom(room)
      })

      setMembers((members) => {
        return [...room.members];
      });

      socket.on("game_can_start", roomId => {
        console.log('game can start: was called')
        socket.emit("start_game", {roomId, user: currentUser});
      });

      socket.on("new_current_player", (currentPlayer) => {
        console.log(currentPlayer);
        setCurrentPlayer(currentPlayer);
        //console.log(" -- current_player -- ", currentPlayer);
      });

      //console.log(room)
      if(room.currentPlayer) setCurrentPlayer(room.currentPlayer)
    });

    socket.on("user_enter_room", (user) => {
      updateMembers("enter", user, setMembers);
    });

    socket.on("user_leave_room", (user) => {
      updateMembers("leave", user, setMembers);
    });

    socket.on('song_code_arrived', songCode => {})
  }, [socket]);

  useEffect(() => {
    if (!thisRoom) return;
    setMembers((members) => {
      return [...thisRoom.members].sort((a, b) => {
        return b.points - a.points
      })
    });
  }, [thisRoom]);

  useEffect(() => {
    //console.log(currentPlayer);
    //if(!currentPlayer) setCurrentPlayer(currentUser)
    if (!currentPlayer || !currentUser) return;
    if (currentUser.id === currentPlayer.id) {
      
      setUserIsTheCurrentPlayer(true);
    } else {
      setUserIsTheCurrentPlayer(false);
    }
  }, [currentUser, currentPlayer]);

  function getThisRoom() {
    socket.emit("get_room", "ROOM_" + ROOM_ID);
  }

  return (
    <div className={styles["container"]}>
      <aside className={mobileMenuOpen ? styles["mobile-menu-open"] : ""}>
        <img
          onClick={() => setMobileMenuOpen(false)}
          className={styles["menu-icon"]}
          style={{ width: "20px", marginRight: "10px" }}
          src={menuIcon2}
          alt=""
        />
        <h2>Participantes:</h2>
        <div className={styles["user-container"]}></div>
        {members.length > 0 && currentPlayer
          ? members.map((member) => {
              return (
                <UserInRoom options={{ member, currentPlayer, thisRoom }} />
              );
            })
          : ""}
      </aside>
      {!userIsTheCurrentPlayer ? (
        <main className={styles["main"]}>
          <GameInfoBord
            room={thisRoom}
            currentPlayer={currentPlayer}
            roomId={"ROOM_" + ROOM_ID}
            setMobileMenuOpen={setMobileMenuOpen}
          />
          <TipContainer room={thisRoom} />
          <Chat room={thisRoom} roomId={"ROOM_" + ROOM_ID} />
          <GuessContainer room={thisRoom} roomId={"ROOM_" + ROOM_ID} />
        </main>
      ) : (
        <CurrentPlayerBord
          room={thisRoom}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      )}
    </div>
  );
}

/*
let timer = 1 * 60

      const timerInterval = setInterval(() => {
        this.io.of("/").to(roomId).emit("timer_update", timer);
        timer--;
      }, 1000);
      
    this.game.startGameTime(() => {
      this._handleNewCurrentPlayer(roomId);
      this._startRound(roomId)
      if(timerInterval) clearInterval(timerInterval)
      timer = 1 * 60

      this.io.of("/").to(roomId).emit("song_code_arrived", songCode);
    });
*/ 
