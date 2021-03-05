import Head from 'next/head'
import 'rodal/lib/rodal.css'
import styles from '../styles/Home.module.css'
import InitalForm from '../components/initialForm'
import RoomSelector from '../components/roomSelector'
import { useState } from 'react'
import { useEffect } from 'react'

import Rodal from 'rodal'

import io from 'socket.io-client'
import { useContext } from 'react'
import { GlobalContext } from '../context/GlobalContext'
const socket = io.connect("http://localhost:8080");

export default function Home() {
  const [connected, setConnected] = useState(false)
  const [globalState, setGlobalState] = useContext(GlobalContext)
  const [username, setUsername] = useState("");
  

  useEffect(() => {
    function connect() {
      if (!connected && io) {
        // connect
        setGlobalState(state => {
          return {...state, socket: socket}
        })

        //handle connection to the server
        socket.on("user_connected", () => {
          console.log('connected');

          /*setGlobalState(state => {
            return { ...state, currentUser: { ...state.currentUser, id: user.id } };
          })*/
          socket.emit("message", { text: "connected", time: Date.now() });
        });
      }
    }
    connect()
  }, [])

  

  return (
    <div className={styles.container}>
      <Head>
        <title>Songyer</title>
      </Head>

      <InitalForm username={username} setUsername={setUsername} />
      <RoomSelector username={username} />
    </div>
  );
}
