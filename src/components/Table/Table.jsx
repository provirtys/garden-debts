import { products } from "../../data/products"
import { persons } from "../../data/persons"
import firebase from '../../firebase'
import { useEffect } from "react"


export function Table() {

  const toggleCheckbox = (e) => {
    let td = e.target.closest("td")
    td.classList.toggle("checked")

    let checked = e.target.checked
    let person = td.dataset.person
    let product = td.dataset.product
    if(checked){
      firebase.addUsing(person,product)
    }
  }

  useEffect(() => {
    firebase.getUsings().then(usings=> console.log(usings))
    // console.log(docs);
  })


  return (
    <table className="table">
      <thead>
        <tr className="table-names">
          <th colSpan={2}>Продукты</th>
          {persons.map((person, idx) => {
            return (
              <th className="table-cell-name" key={person.name}>
                {person.title}
                <img className="person-img" src={person.img} alt="" />
              </th>
            )
          })}
          <th>Сумма (руб.)</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, idx) => {
          return (
            <tr key={product.name}>
              <td>{idx + 1}</td>
              <td>{product.title}</td>
              {persons.map((person) => {
                return (
                  <td className="td-checkbox" data-product={product.name} data-person={person.name} key={person.name}>
                    <label>
                      <input onClick={toggleCheckbox} type="checkbox" />
                    </label>
                  </td>
                )
              })}
              <td>{product.price}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
