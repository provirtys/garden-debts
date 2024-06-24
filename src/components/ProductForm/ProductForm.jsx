import './ProductForm.scss';
import React, { useEffect, useMemo, useState } from 'react';
import { TextField } from "@mui/material"
import Button from '@mui/material/Button';



export const ProductForm = ({ onSubmit, action, product }) => {

  const [form, setForm] = useState({
    name: '',
    price: '',
    title: '',
  });

  useEffect(() => {
    if (action === 'edit') {
      setForm({
        id: product.id,
        name: product.name ?? '',
        price: product.price,
        title: product.title
      })
    }
    else if(action === 'add') {
      setForm({
        name: '',
        price: '',
        title: ''
      })
    }
  }, [action, product])

  const title = useMemo(() => action === 'add' ? 'Добавление продукта' : 'Изменение продукта', [action]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <>
    <h2>{title}</h2>
    <form className='product-form' onSubmit={handleSubmit}>
      <TextField className='product-form__input' label="Код (например: apple)" variant="outlined" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <TextField className='product-form__input' label="Название" variant="outlined" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
      <TextField className='product-form__input' label="Сумма (руб.)" type='number' variant="outlined" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
      {action === 'add' && <Button className="add-product" variant="contained" type='submit'>Добавить</Button>}
      {action === 'edit' && <Button className="add-product" variant="contained" type='submit'>Сохранить</Button>}
    </form>
    </>
  );
};
