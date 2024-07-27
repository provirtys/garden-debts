import { Table } from "./components/Table/Table"
import "./scss/index.scss"
import { useState, useEffect, useMemo } from "react"
import firebase, { storage } from "./firebase"
import Modal from "./components/Modal/Modal"
import Loader from "./components/loader"
import { ProductForm } from "./components/ProductForm/ProductForm"
import { PersonForm } from "./components/PersonForm/PersonForm"
import Button from "@mui/material/Button"
import * as React from "react"
import { PieChart } from "@mui/x-charts/PieChart"
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage"
import { v4 } from "uuid"

function App() {
  const [loadingModal, setLoadingModal] = useState(false)
  const [productModal, setProductModal] = useState(false)
  const [personModal, setPersonModal] = useState(false)
  const [persons, setPersons] = useState([])
  const [products, setProducts] = useState([])
  const [usings, setUsings] = useState([])
  const [productFormAction, setProductFormAction] = useState("")
  const [personFormAction, setPersonFormAction] = useState("")
  const [productToChange, setProductToChange] = useState({})
  const [personToChange, setPersonToChange] = useState({})

  const fetchUsings = async () => {
    await firebase.getUsings().then((usings) => setUsings(usings))
  }

  const updateDebts = () => {
    const updatedPersons = persons.map((person) => ({
      ...person,
      debt: 0,
    }))

    usings.forEach((using) => {
      const person = updatedPersons.find((person) => person.id === using.person)
      const product = products.find((product) => product.id === using.product)
      if (person && product) {
        person.debt += product.price / +pricePerProducts[product.id].toFixed(2)
      }
    })

    setPersons(updatedPersons)
  }

  const pricePerProducts = useMemo(
    () =>
      usings.reduce((acc, using) => {
        acc[using.product] = (acc[using.product] || 0) + 1
        return acc
      }, {}),
    [usings]
  )

  const onToggleCheckbox = async (e) => {
    let td = e.target.closest("td")
    const isChecked = e.target.checked
    const person = td.dataset.person
    const product = td.dataset.product
    if (isChecked) {
      td.classList.add("checked")
      await firebase.addUsing(person, product)
    } else {
      const doc = td.dataset.doc
      td.classList.remove("checked")
      await firebase.removeUsing(doc)
    }
    await fetchUsings()
    updateDebts()
  }

  const openProductModal = (action, product) => {
    setProductFormAction(action)
    setProductToChange(product)
    setProductModal(true)
  }

  const openPersonModal = (action, person) => {
    setPersonFormAction(action)
    setPersonToChange(person)
    setPersonModal(true)
  }

  const onSaveProduct = async (product) => {
    setLoadingModal(true)
    if (productFormAction === "add") {
      await firebase.addProduct(product.name, product.title, product.price)
    } else if (productFormAction === "edit") {
      await firebase.editProduct(productToChange.id, product)
    }
    const newProducts = await firebase.getProducts()
    setProducts(newProducts)
    setProductModal(false)
    setLoadingModal(false)
  }

  const onDeleteProduct = async (product) => {
    setLoadingModal(true)
    await firebase.deleteProduct(product.id)
    const newProducts = await firebase.getProducts()
    setProducts(newProducts)
    setProductModal(false)
    setLoadingModal(false)
  }

  const onSavePerson = async (person) => {
    setLoadingModal(true)
    if (person.image) {
      person.image = await uploadImage(person.image)
    }
    if (personFormAction === "add") {
      await firebase.addPerson(person.name, person.title, person.image)
    } else if (personFormAction === "edit") {
      await firebase.editPerson(personToChange.id, person)
    }
    const newPersons = await firebase.getPersons()
    setPersons(newPersons)
    setPersonModal(false)
    setLoadingModal(false)
  }

  const onDeletePerson = async (person) => {
    setLoadingModal(true)
    await firebase.deletePerson(person.id)
    const newPersons = await firebase.getPersons()
    setPersons(newPersons)
    setPersonModal(false)
    setLoadingModal(false)
  }

  const chartData = useMemo(() => {
    if (persons.length) {
      return persons?.map((person) => ({
        id: person.id,
        label: person.title,
        value: person.debt,
      }))
    } else {
      return []
    }
  }, [persons])

  const uploadImage = async (image) => {
    if (image == null) return
    const imageRef = ref(storage, `images/${image.name + v4()}`)
    return uploadBytes(imageRef, image).then(async (snapshot) => await getDownloadURL(snapshot.ref).then(url => url))
  }

  useEffect(() => {
    setLoadingModal(true)
    async function fetchData() {
      try {
        const [fetchedPersons, fetchedProducts, fetchedUsings] =
          await Promise.all([
            firebase.getPersons(),
            firebase.getProducts(),
            firebase.getUsings(),
          ])
        setPersons(fetchedPersons)
        setProducts(fetchedProducts)
        setUsings(fetchedUsings)
        setLoadingModal(false)
      } catch (e) {
        console.error(e)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    updateDebts()
  }, [usings, products])

  return (
    <div className="container">
      <h1>Это приложение создано для сбора долгов</h1>
      <div className="action-buttons">
        <Button
          className="add-product action-buttons__button"
          onClick={() => openProductModal("add")}
          variant="contained"
        >
          <svg fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
            width="14" height="14" viewBox="0 0 45.402 45.402"
          >
            <g>
              <path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141
		c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27
		c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435
		c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z"/>
            </g>
          </svg>
          Добавить продукт
        </Button>
        <Button
          className="add-person action-buttons__button"
          onClick={() => openPersonModal("add")}
          variant="contained"
        >
          <svg fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
            width="14" height="14" viewBox="0 0 45.402 45.402"
          >
            <g>
              <path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141
		c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27
		c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435
		c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z"/>
            </g>
          </svg>
          Добавить человека
        </Button>
      </div>
      <div className="content">
        <Table
          persons={persons}
          products={products}
          usings={usings}
          pricePerProducts={pricePerProducts}
          onToggleCheckbox={onToggleCheckbox}
          onEditProduct={(product) => {
            openProductModal("edit", product)
          }}
          onEditPerson={(person) => {
            openPersonModal("edit", person)
          }}
        />
        <PieChart series={[{ data: chartData }]} width={400} height={200} />
      </div>
      <Modal open={loadingModal} allowClose={false}>
        <Loader />
      </Modal>
      <Modal open={productModal} onClose={() => setProductModal(false)}>
        <ProductForm
          onSaveProduct={onSaveProduct}
          onDeleteProduct={onDeleteProduct}
          action={productFormAction}
          product={productToChange}
        />
      </Modal>
      <Modal open={personModal} onClose={() => setPersonModal(false)}>
        <PersonForm
          onSavePerson={onSavePerson}
          onDeletePerson={onDeletePerson}
          action={personFormAction}
          person={personToChange}
        />
      </Modal>
    </div>
  )
}

export default App
