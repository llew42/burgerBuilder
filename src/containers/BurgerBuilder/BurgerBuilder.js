import React, {useState, lazy, useEffect} from 'react'
import Aux from '../../hoc/Aux/Aux'
import {useHistory} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import * as actions from '../../store/actions/index'

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

  const dispatch = useDispatch(actions.initIngredients())

  const onIngredientAdded = ingName => dispatch(actions.addIngredient(ingName))
  const onIngredientDeleted = ingName =>
    dispatch(actions.deleteIngredient(ingName))
  const onInitPurchase = () => dispatch(actions.purchaseInit())
  const onSetAuthRedirect = path => dispatch(actions.setAuthRedirect(path))

  const ingredients = useSelector(state => {
    return state.burgerBuilder.ingredients
  })
  const price = useSelector(state => {
    return state.burgerBuilder.totalPrice
  })
  const error = useSelector(state => {
    return state.burgerBuilder.error
  })
  const isAuthenticated = useSelector(state => {
    return state.auth.token !== null
  })

  let history = useHistory()

  useEffect(() => {
    dispatch(actions.initIngredients())
  }, [dispatch])

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
    if (isAuthenticated) {
      setPurchasing(true)
    } else {
      onSetAuthRedirect('/checkout')
      props.history.push('/auth')
    }
  }

  const purchaseCancelled = () => {
    setPurchasing(false)
  }

  const purchaseContinued = () => {
    onInitPurchase()
    history.push({pathname: '/checkout'})
  }

  const closeModal = () => {
    setPurchasing(false)
  }

  const disabledInfo = {
    ...ingredients,
  }
  for (const key in disabledInfo) {
    disabledInfo[key] = disabledInfo[key] <= 0
  }

  let orderSummary
  let burger = error ? <p>Can't load the page</p> : <Spinner />

  if (ingredients) {
    burger = (
      <Aux>
        <Burger ingredients={ingredients} />
        <BuildControls
          ingredientAdded={onIngredientAdded}
          ingredientRemoved={onIngredientDeleted}
          disabled={disabledInfo}
          purchasable={updatePurchaseState(ingredients)}
          price={price}
          ordered={purchaseHandler}
          isAuth={isAuthenticated}
        />
      </Aux>
    )
    orderSummary = (
      <OrderSummary
        ingredients={ingredients}
        purchaseCancelled={purchaseCancelled}
        purchaseContinued={purchaseContinued}
        price={price}
      />
    )
  }
  return (
    <Aux>
      {error && <div>Something went wrong ...</div>}
      <Modal show={purchasing} modalClosed={closeModal}>
        {orderSummary}
      </Modal>
      {burger}
    </Aux>
  )
}

export default BurgerBuilder
