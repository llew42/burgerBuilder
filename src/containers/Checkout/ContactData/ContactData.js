import React, {useState} from 'react'
import Button from '../../../components/UI/Button/Button'
import classes from './ContactData.css'
import Spinner from '../../../components/UI/Spinner/Spinner'
import Input from '../../../components/UI/Input/Input'
import {connect} from 'react-redux'
import {updatedObject, checkValidity} from '../../../shared/utility'
import * as actions from '../../../store/actions/index'

function ContactData(props) {
  const [formIsValid, setFormIsValid] = useState(false)
  const [orderForm, setOrderForm] = useState({
    name: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Your Name',
      },
      value: '',
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    street: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Street',
      },
      value: '',
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    zipCode: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'ZIP Code',
      },
      value: '',
      validation: {
        required: true,
        minLength: 5,
        maxLength: 5,
        isNumeric: true,
      },
      valid: false,
      touched: false,
    },
    country: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Country',
      },
      value: '',
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    email: {
      elementType: 'input',
      elementConfig: {
        type: 'email',
        placeholder: 'Email',
      },
      value: '',
      validation: {
        required: true,
        isEmail: true,
      },
      valid: false,
      touched: false,
    },
    deliveryMethod: {
      elementType: 'select',
      elementConfig: {
        options: [
          {value: 'fastest', displayValue: 'Fastest'},
          {value: 'cheapest', displayValue: 'Cheapest'},
        ],
      },
      value: 'fastest',
      validation: {},
      valid: true,
    },
  })

  const ordered = e => {
    e.preventDefault()
    const formData = {}
    for (let formElemIdentifier in orderForm) {
      formData[formElemIdentifier] = orderForm[formElemIdentifier].value
    }
    const order = {
      ingredients: props.ingredients,
      price: props.price,
      orderData: formData,
      userId: props.userId,
    }

    props.onOrderBurger(order, props.token)
  }

  const inputChanged = (e, inputIndentifier) => {
    const updatedFormElement = updatedObject(orderForm[inputIndentifier], {
      value: e.target.value,
      valid: checkValidity(
        e.target.value,
        orderForm[inputIndentifier].validation
      ),
      touched: true,
    })
    const updatedOrderForm = updatedObject(orderForm, {
      [inputIndentifier]: updatedFormElement,
    })

    let formIsValid = true
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid
    }

    setOrderForm(updatedOrderForm)
    setFormIsValid(formIsValid)
  }

  const formElementsArray = []
  for (let key in orderForm) {
    formElementsArray.push({
      id: key,
      config: orderForm[key],
    })
  }

  let form = (
    <form onSubmit={ordered}>
      {formElementsArray.map(fe => (
        <Input
          key={fe.id}
          elementType={fe.config.elementType}
          elementConfig={fe.config.elementConfig}
          value={fe.config.value}
          invalid={!fe.config.valid}
          shouldValidate={fe.config.validation}
          touched={fe.config.touched}
          changed={e => inputChanged(e, fe.id)}
        />
      ))}
      <Button btnType="Success" disabled={!formIsValid}>
        ORDER
      </Button>
    </form>
  )
  if (props.loading) {
    form = <Spinner />
  }

  return (
    <div className={classes.ContactData}>
      <h4>Enter your info</h4>
      {form}
    </div>
  )
}

const mapStateToProps = state => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onOrderBurger: (orderData, token) =>
      dispatch(actions.purchaseBurger(orderData, token)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ContactData)
