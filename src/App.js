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
      <Button
        className="add-product"
        onClick={() => openProductModal("add")}
        variant="contained"
      >
        Добавить продукт
      </Button>
      <Button
        className="add-person"
        onClick={() => openPersonModal("add")}
        variant="contained"
      >
        Добавить человека
      </Button>
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
