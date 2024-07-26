import './Table.scss'


export function Table({ persons, products, usings, pricePerProducts, onToggleCheckbox, onEditProduct, onEditPerson }) {

  const sumProducts = products.reduce((acc, product) => acc + +product.price, 0)

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr className="table-names">
            <th colSpan={3}>Продукты</th>
            {persons.map((person) => {
              return (
                <th className="table-cell-name" key={person.name}>
                  {person.title}
                  <img className="person-img" src={person.img} alt="" />
									<button className='person-edit' onClick={() => onEditPerson(person)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18px" height="18px">    <path d="M 18.414062 2 C 18.158062 2 17.902031 2.0979687 17.707031 2.2929688 L 15.707031 4.2929688 L 14.292969 5.7070312 L 3 17 L 3 21 L 7 21 L 21.707031 6.2929688 C 22.098031 5.9019687 22.098031 5.2689063 21.707031 4.8789062 L 19.121094 2.2929688 C 18.926094 2.0979687 18.670063 2 18.414062 2 z M 18.414062 4.4140625 L 19.585938 5.5859375 L 18.292969 6.8789062 L 17.121094 5.7070312 L 18.414062 4.4140625 z M 15.707031 7.1210938 L 16.878906 8.2929688 L 6.171875 19 L 5 19 L 5 17.828125 L 15.707031 7.1210938 z" /></svg>
                  </button>
                </th>
              )
            })}
            <th>Сумма (руб.)</th>
            <th>+ в долг</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, idx) => {
            return (
              <tr key={product.id}>
                <td>
                  <button onClick={() => onEditProduct(product)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18px" height="18px">    <path d="M 18.414062 2 C 18.158062 2 17.902031 2.0979687 17.707031 2.2929688 L 15.707031 4.2929688 L 14.292969 5.7070312 L 3 17 L 3 21 L 7 21 L 21.707031 6.2929688 C 22.098031 5.9019687 22.098031 5.2689063 21.707031 4.8789062 L 19.121094 2.2929688 C 18.926094 2.0979687 18.670063 2 18.414062 2 z M 18.414062 4.4140625 L 19.585938 5.5859375 L 18.292969 6.8789062 L 17.121094 5.7070312 L 18.414062 4.4140625 z M 15.707031 7.1210938 L 16.878906 8.2929688 L 6.171875 19 L 5 19 L 5 17.828125 L 15.707031 7.1210938 z" /></svg>
                  </button>
                </td>
                <td className='row-number'>{idx + 1}</td>
                <td>{product.title}</td>
                {persons.map((person) => {
                  const doc = usings.find((using) => using.person === person.id && using.product === product.id)
                  const classes = "td-checkbox " + (doc ? "checked" : "")
                  return (
                    <td className={classes} data-product={product.id} data-person={person.id} data-doc={doc?.id} key={person.name}>
                      <label>
                        <input onChange={onToggleCheckbox} type="checkbox" checked={doc ? true : false} />
                      </label>
                    </td>
                  )
                })}
                <td>{product.price}</td>
                <td>{pricePerProducts[product.id] ? +(product.price / pricePerProducts[product.id]).toFixed(2) : 0}</td>
              </tr>
            )
          })}
          <tr>
            <td colSpan={3}>Итого:</td>
            {persons.map((person) => {
              return (
                <td key={person.id}>{person.debt ? +(person.debt).toFixed(2) : 0}</td>
              )
            })}
            <td>{sumProducts}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
