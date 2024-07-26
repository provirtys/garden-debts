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
      person.debt += product.price / +pricePerProducts[product.id].toFixed(2)
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

  const onProductFormSubmit = async (product) => {
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

  const onPersonFormSubmit = async (person) => {
    setLoadingModal(true)
    if (personFormAction === "add") {
      console.log(person)
      await firebase.addPerson(person.name, person.title, person.price)
    } else if (personFormAction === "edit") {
      await firebase.editPerson(personToChange.id, person)
    }
    const newPerons = await firebase.getPersons()
    setPersons(newPerons)
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

  const [imageUpload, setImageUpload] = useState(null)
  const [imageList, setImageList] = useState([])
  const imageListRef = ref(storage, "images/")

  const uploadImage = () => {
    if (imageUpload == null) return

    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`)
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageList((oldArray) => [...oldArray, url])
      })
    })
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

    listAll(imageListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageList((oldArray) => [...oldArray, url])
        })
      })
    })

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
      <Modal open={loadingModal} allowClose={false}>
        <Loader />
      </Modal>
      {}
      <Modal open={productModal} onClose={() => setProductModal(false)}>
        <ProductForm
          onSubmit={onProductFormSubmit}
          action={productFormAction}
          product={productToChange}
        />
      </Modal>
      <Modal open={personModal} onClose={() => setPersonModal(false)}>
        <PersonForm
          onSubmit={onPersonFormSubmit}
          action={personFormAction}
          person={personToChange}
        />
      </Modal>
      <input onChange={(e) => setImageUpload(e.target.files[0])} type="file" />
      <button onClick={uploadImage}>Upload image</button>
    </div>
  )
}

export default App
