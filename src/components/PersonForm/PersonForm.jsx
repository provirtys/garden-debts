import "./PersonForm.scss"
import React, { useEffect, useMemo, useState } from "react"
import { TextField, Input } from "@mui/material"
import Button from "@mui/material/Button"

export const PersonForm = ({ onSubmit, action, person }) => {
  const [form, setForm] = useState({
    name: "",
    title: "",
    // image: "",
  })

  useEffect(() => {
    if (action === "edit") {
      setForm({
        name: person.name ?? "",
        title: person.title,
        // image: person.image,
      })
    } else if (action === "add") {
      setForm({
        name: "",
        title: "",
        // image: "",
      })
    }
  }, [action, person])

  const title = useMemo(
    () => (action === "add" ? "Добавление человека" : "Изменение человека"),
    [action]
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(form)
  }

  return (
    <>
      <form className="entity-form" onSubmit={handleSubmit}>
        <h2 className="entity-form__title">{title}</h2>
        <TextField
          className="entity-form__input"
          label="Название (например: Ivan)"
          variant="outlined"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <TextField
          className="entity-form__input"
          label="Имя"
          variant="outlined"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <Input
          className="entity-form__input"
          type="file"
          // onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
        />
        {action === "add" && (
          <Button className="add-person" variant="contained" type="submit">
            Добавить
          </Button>
        )}
        {action === "edit" && (
          <Button className="add-person" variant="contained" type="submit">
            Сохранить
          </Button>
        )}
      </form>
    </>
  )
}
