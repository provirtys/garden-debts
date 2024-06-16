import Loader from "./loader"

function Modal({show}){
  return(
    <div className={`modal ${show ? 'show' : ""}`}>
      <Loader />
    </div>
  )
}

export default Modal