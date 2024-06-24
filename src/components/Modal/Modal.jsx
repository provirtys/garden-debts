import { useState, useEffect, useRef } from 'react'
import './Modal.scss'

function Modal({ children, open, onClose, allowClose = true, title}) {

  const modalRef = useRef(null)

  useEffect(() => {
    if (open && !modalRef.current.open) {
      modalRef.current.showModal()
    }
    else if (!open && modalRef.current.open) {
      modalRef.current.close()
    }
  }, [open])

  useEffect(() => {
    if(allowClose) {
      const handleModalClick = ({ currentTarget, target }) => {
        if (currentTarget === target) {
          if(onClose){
            onClose()
          } 
        }
      }
  
      modalRef.current.addEventListener('click', handleModalClick)
    }
  }, [])

  return (
    <dialog ref={modalRef} className='modal'>
      <div className='modal-content'>
        <h2 className='modal-title'>{title}</h2>
        {children}
      </div>
    </dialog>
  )
}

export default Modal