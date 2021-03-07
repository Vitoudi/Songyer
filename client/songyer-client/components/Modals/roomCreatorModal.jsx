import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react'
import Rodal from 'rodal'
import { GlobalContext } from '../../context/GlobalContext';
import styles from '../../styles/Modal.module.css'

export default function RoomCreatorModal({modalState, setModalState, username}) {
    const [globalState, setGlobalState] = useContext(GlobalContext);
    const { socket, currentUser } = globalState;
    const router = useRouter();
    const [roomName, setRoomName] = useState('')

    function handleClick() {
      if (!socket) return;

      function setListeners() {
        socket.on("room_created", (room) => {
          socket.emit("create_user", { username, roomId: room.id });

          socket.emit('set_game', room)

          socket.on("user_created", (user) => {
            socket.emit("enter_room", { roomId: room.id, user });
            setGlobalState((state) => {
              return {
                ...state,
                currentUser: {
                  ...state.currentUser,
                  id: user.id,
                  username,
                  currentRoom: room.id,
                },
              };
            });
          });

          socket.on("user_enter_room", () => {
            router.push("/room/" + room.id);
          });
        });

      }

      function createRoom() {
        console.log(username);
        if (!username) return;
        socket.emit("create_room",  roomName );
      }

      setListeners();
      createRoom();
    }
    return (
      <Rodal
        onClose={() => {
          setModalState((state) => {
            return { ...state, isOpen: false };
          });
        }}
        visible={modalState.isOpen}
        className="modal"
      >
        <div className={styles["container"]}>
          <h2 className={styles["title"]}>Sua sala:</h2>
          <div className={styles["center-container"]}>
            <label>
              Nome:{" "}
              <input
                value={roomName}
                onChange={(e) => {
                  setRoomName(e.target.value);
                }}
                type="text"
                placeholder="nome da sala. Ex: 'só Rock'"
                className={styles["input"]}
                name=""
                id=""
              />
            </label>

            <label>
              Tipo:{" "}
              <select placeholder="tipo" name="" id="">
                <option value="">geral</option>
                <option value="">artista</option>
                <option value="">gênero</option>
                <option value="">outro</option>
              </select>
            </label>
          </div>
          <button onClick={handleClick} className="btn-1">
            criar sala
          </button>
        </div>
      </Rodal>
    );
}