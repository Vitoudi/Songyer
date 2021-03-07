import React from 'react'
import Rodal from 'rodal'
import styles from '../../styles/Modal.module.css'

export default function WarningModal({children, modalState, setModalState, setWarningMsg}) {

    function handleClick() {
        setModalState(state => {
            return {...state, isOpen: false}
        })
    }
    return (
      <Rodal
        onClose={() => {
          setModalState((state) => {
            return { ...state, isOpen: false };
          });
        }}
        visible={modalState.isOpen}
        height={200}
        className="modal"
      >
        <div className={styles["container"]}>
          <h2 style={{ color: "rgb(200, 0, 0)" }}>Atenção</h2>
          <h3 style={{ textAlign: "center", alignSelf: "start" }}>
            {children}
          </h3>
          <button onClick={handleClick} className="btn-1">
            Ok
          </button>
        </div>
      </Rodal>
    );
}
