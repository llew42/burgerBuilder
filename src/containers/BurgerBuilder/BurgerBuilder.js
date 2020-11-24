import React, {useState, lazy, useEffect} from 'react'
import Aux from '../../hoc/Aux/Aux'
import {useHistory} from 'react-router-dom'
import {connect} from 'react-redux'
import * as actions from '../../store/actions/index'
// import WithError from '../../hoc/withError/withError'

const BuildControls = lazy(() =>
  import('../../components/Burger/BuildControls/BuildControls')
)
const Burger = lazy(() => import('../../components/Burger/Burger'))

const Modal = lazy(() => import('../../components/UI/Modal/Modal'))
const Spinner = lazy(() => import('../../components/UI/Spinner/Spinner'))
const OrderSummary = lazy(() =>
  import('../../components/Burger/OrderSummary/OrderSummary')
)

export function BurgerBuilder(props) {
  const [purchasing, setPurchasing] = useState(false)

  let history = useHistory()

  useEffect(() => {
    props.onInitIngredients()
  }, [])

  const updatePurchaseState = ingredients => {
    const sum = Object.keys(ingredients)
      .map(i => {
        return ingredients[i]
      })
      .reduce((sum, el) => {
        return sum + el
      }, 0)
    return sum > 0
  }

  const purchaseHandler = () => {
    if (props.isAuthenticated) {
      setPurchasing(true)
    } else {
      props.onSetAuthRedirect('/checkout')
      props.history.push('/auth')
    }
  }

  const purchaseCancelled = () => {
    setPurchasing(false)
  }

  const purchaseContinued = () => {
    props.onInitPurchase()
    history.push({pathname: '/checkout'})
  }

  const closeModal = () => {
    setPurchasing(false)
  }

  const disabledInfo = {
    ...props.ingredients,
  }
  for (const key in disabledInfo) {
    disabledInfo[key] = disabledInfo[key] <= 0
  }

  let orderSummary
  let burger = props.error ? <p>Can't load the page</p> : <Spinner />

  if (props.ingredients) {
    burger = (
      <Aux>
        <Burger ingredients={props.ingredients} />
        <BuildControls
          ingredientAdded={props.onIngredientAdded}
          ingredientRemoved={props.onIngredientDeleted}
          disabled={disabledInfo}
          purchasable={updatePurchaseState(props.ingredients)}
          price={props.price}
          ordered={purchaseHandler}
          isAuth={props.isAuthenticated}
        />
      </Aux>
    )
    orderSummary = (
      <OrderSummary
        ingredients={props.ingredients}
        purchaseCancelled={purchaseCancelled}
        purchaseContinued={purchaseContinued}
        price={props.price}
      />
    )
  }
  return (
    <Aux>
      {props.error && <div>Something went wrong ...</div>}
      <Modal show={purchasing} modalClosed={closeModal}>
        {orderSummary}
      </Modal>
      {burger}
    </Aux>
  )
}

const mapStateToProps = state => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    purchased: state.order.purchased,
    isAuthenticated: state.auth.token !== null,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: ingName => dispatch(actions.addIngredient(ingName)),
    onIngredientDeleted: ingName => dispatch(actions.deleteIngredient(ingName)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onInitPurchase: () => dispatch(actions.purchaseInit()),
    onSetAuthRedirect: path => dispatch(actions.setAuthRedirect(path)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BurgerBuilder)
