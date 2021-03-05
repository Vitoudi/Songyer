import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

export const GlobalContext = React.createContext(null)

const defaultState = {
    socket: null,
    currentUser: {
        id: '',
        username: '',
        currentRoom: '',
    }
}

export function GlobalContextProvider({children}) {
    const [globalState, setGlobalState] = useState(defaultState)

    useEffect(()=> {
        console.log(globalState)
    }, [globalState])

    return (
        <GlobalContext.Provider value={[globalState, setGlobalState]}>
            {children}
        </GlobalContext.Provider>
    )
}
