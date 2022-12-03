import React from "react"
import './modal.css'

const Modal = ({isVisible, onClose, children }) => {
  if ( !isVisible ) return null

  const handleClose = (e) => {
    if(e.target.id === 'wrapper') onClose()
  }

  return (
    <div className='overflow-y-auto fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-10' id='wrapper' onClick={handleClose}>
      <div className="w-[600px] fex flex-col"> 
        <button className="text-white text-xl place-self-end close-btn" onClick={() => onClose()}>X</button>
        <div className="bg-white p-2 rounded">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal