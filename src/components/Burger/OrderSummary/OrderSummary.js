import React from 'react'
import Aux from '../../../hoc/Aux/Aux'
import Button from '../../UI/Button/Button'

function OrderSummary(props) {
  const ingredientSummary = Object.keys(props.ingredients).map(i => {
    return (
      <li key={i}>
        <span style={{textTransform: 'capitalize', marginRight: '8px'}}>
          {i}
        </span>
        <span>{props.ingredients[i]}</span>
      </li>
    )
  })

  return (
    <Aux>
      <h3>Your Order</h3>
      <p>Delicous burger with the following ingredients:</p>
      <ul>{ingredientSummary}</ul>
      <p>
        <strong>Total price: ${props.price.toFixed(2)}</strong>
      </p>
      <p>Continue to checkout?</p>
      <Button btnType="Danger" clicked={props.purchaseCancelled}>
        CANCEL
      </Button>
      <Button btnType="Success" clicked={props.purchaseContinued}>
        CONTINUE
      </Button>
    </Aux>
  )
}

export default OrderSummary
