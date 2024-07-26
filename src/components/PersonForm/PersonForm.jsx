import "./PersonForm.scss"
import React, { useEffect, useMemo, useState } from "react"
import { TextField, Input } from "@mui/material"
import Button from "@mui/material/Button"

export const PersonForm = ({ action, person, onSavePerson, onDeletePerson }) => {
  const [form, setForm] = useState({
    name: "",
    title: "",
    image: null,
  })

  useEffect(() => {
    if (action === "edit") {
      setForm({
        name: person.name ?? "",
        title: person.title,
        image: person.image,
      })
    } else if (action === "add") {
      setForm({
        name: "",
        title: "",
        image: null,
      })
    }
  }, [action, person])

  const title = useMemo(
    () => (action === "add" ? "Добавление человека" : "Изменение человека"),
    [action]
  )

  const addPersonHandler = () => {
    onSavePerson(form)
  }

  const deletePersonHandler = () => {
    onDeletePerson(person)
  }

  return (
    <>
      <form className="entity-form" onSubmit={e => e.preventDefault()}>
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
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
        />
        {action === "add" && (
          <Button className="form-button add-person" variant="contained" type="submit" onClick={addPersonHandler}>
            Добавить
          </Button>
        )}
        {action === "edit" &&
          <>
            <Button className="form-button add-person" variant="contained" type="submit" onClick={addPersonHandler}>
              Сохранить
            </Button>
            <Button className="form-button delete-person" color="error" variant="contained" type="submit" onClick={deletePersonHandler}>
              Удалить
            </Button>
          </>
        }
      </form>
    </>
  )
}
