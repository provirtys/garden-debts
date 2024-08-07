import './ProductForm.scss';
import React, { useEffect, useMemo, useState } from 'react';
import { TextField } from "@mui/material"
import Button from '@mui/material/Button';



export const ProductForm = ({ action, product, onSaveProduct, onDeleteProduct }) => {

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
    else if (action === 'add') {
      setForm({
        name: '',
        price: '',
        title: ''
      })
    }
  }, [action, product])

  const title = useMemo(() => action === 'add' ? 'Добавление продукта' : 'Изменение продукта', [action]);

  const onSaveProductHandler = (event) => {
    onSaveProduct(form);
  };

  const onDeleteProductHandler = (event) => {
    onDeleteProduct(form);
  };

  return (
    <>
      <form className='entity-form' onSubmit={e => e.preventDefault()}>
        <h2 className='entity-form__title'>{title}</h2>
        <TextField className='entity-form__input' label="Название" variant="outlined" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <TextField className='entity-form__input' label="Сумма (руб.)" type='number' variant="outlined" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
        {action === 'add' && <Button className="add-product" variant="contained" type='submit' onClick={onSaveProductHandler}>Добавить</Button>}
        {action === 'edit' &&
					<div className="form-buttons">
            <Button className="add-product" variant="contained" type='submit' onClick={onSaveProductHandler}>Сохранить</Button>
            <Button className="remove-product" variant="contained" type='submit' color='error' onClick={onDeleteProductHandler}>Удалить</Button>
          </div>
        }
      </form>
    </>
  );
};
