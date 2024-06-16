import { Table } from "./components/Table/Table"
import Modal from "./components/modal"
import "./scss/index.scss"
import { useState } from "react"

function App() {

  const [showModal, setShowModal] = useState(true)

  setTimeout(()=> {
    setShowModal(false)
  }, 2000)

  return (
    <div className="container">
      <h1>Это приложение создано для сбора долгов</h1>
      <Table />
      <Modal show={showModal}/>
    </div>
  )
}

export default App
