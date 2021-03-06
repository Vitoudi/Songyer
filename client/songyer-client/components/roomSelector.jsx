import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { GlobalContext } from "../context/GlobalContext";
import styles from "../styles/Home.module.css";
import RoomCreatorModal from "./Modals/roomCreatorModal";
import WarningModal from "./Modals/warningModal";
import RoomInList from "./roomInList";

export default function RoomSelector({ username }) {
  const [rooms, setRooms] = useState([]);
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'warning',
  });
  const [warningMsg, setWarningMsg] = useState('')
  const [globalState, setGlobalState] = useContext(GlobalContext);
  const { socket, currentUser } = globalState;
  const [gameCanStart, setGameCanStart] = useState('')

  //make initial requests to server
  useEffect(() => {
    if (!socket) return;
    socket.emit("get_rooms");
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on("rooms_recived", (rooms) => {
      console.log(rooms);
      setRooms([...rooms]);
    });

    /*socket.on("game_can_start", roomId => {
      console.log('game can start in: ', roomId);
      socket.emit("start_game", roomId);
    });*/
  }, [socket]);


  function handleClick() {
    const WARNING_MSG = "Você precisa de um nome para criar uma sala";
    setWarningMsg(WARNING_MSG)

    if(username) {setModalState(state => {
      return {...state, type: 'room_creator'}
    })} else {
      setModalState((state) => {
        return { ...state, type: "warning" };
      });
    }
    setModalState(state => {
      return {...state, isOpen: true}
    });
    
  }

  return (
    <section className={styles["room-selector-container"]}>
      <div>
        <div className={styles["initial"]}>
          <h2>Salas:</h2>
          <button className="btn-1" onClick={handleClick}>
            Criar sala <span>+</span>
          </button>
        </div>

        <div className={styles["rooms-container"]}>
          {rooms.length ? (
            rooms.map((room) => {
              return (
                <div key={room.id}>
                  <RoomInList
                    room={room}
                    username={username}
                    setWarningMsg={setWarningMsg}
                    setModalState={setModalState}
                  />
                </div>
              );
            })
          ) : (
            <h2 style={{alignSelf: 'center'}}>Sem salas abertas</h2>
          )}
        </div>
      </div>
      {modalState.type === "warning" ? (
        <WarningModal modalState={modalState} setModalState={setModalState}>
          {warningMsg}
        </WarningModal>
      ) : (
        <RoomCreatorModal
          modalState={modalState}
          setModalState={setModalState}
          username={username}
        />
      )}
    </section>
  );
}