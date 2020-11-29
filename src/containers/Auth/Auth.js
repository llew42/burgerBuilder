import React, {useEffect, useState} from 'react'
import {updatedObject, checkValidity} from '../../shared/utility'
import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'
import * as actions from '../../store/actions/index'
import {connect, useDispatch} from 'react-redux'
import Spinner from '../../components/UI/Spinner/Spinner'
import {Redirect} from 'react-router-dom'

const Auth = props => {
  const [isSignup, setIsSignup] = useState(true)
  const [user, setUser] = useState({
    email: {
      elementType: 'input',
      elementConfig: {
        type: 'email',
        placeholder: 'Email address',
      },
      value: '',
      validation: {
        required: true,
        isEmail: true,
      },
      valid: false,
      touched: false,
    },
    password: {
      elementType: 'input',
      elementConfig: {
        type: 'password',
        placeholder: 'Password',
      },
      value: '',
      validation: {
        required: true,
        minLength: 6,
      },
      valid: false,
      touched: false,
    },
  })

  const dispatch = useDispatch(actions.setAuthRedirect())

  const {buildingBurger, authRedirect} = props

  useEffect(() => {
    if (!buildingBurger && authRedirect !== '/') {
      dispatch(actions.setAuthRedirect('/'))
    }
  }, [dispatch, buildingBurger, authRedirect])

  const formElementsArray = []
  for (let key in user) {
    formElementsArray.push({
      id: key,
      config: user[key],
    })
  }

  const inputChanged = (e, inputValue) => {
    const updatedUserInput = updatedObject(user, {
      [inputValue]: updatedObject(user[inputValue], {
        value: e.target.value,
        valid: checkValidity(e.target.value, user[inputValue].validation),
        touched: true,
      }),
    })
    setUser(updatedUserInput)
  }

  let form = formElementsArray.map(fe => (
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
  ))

  if (props.loading) {
    form = <Spinner />
  }

  let errorMessage = null

  if (props.error) {
    errorMessage = <p>{props.error.message}</p>
  }

  let redirectAuthorization = null
  if (props.isAuthenticated) {
    redirectAuthorization = <Redirect to={props.authRedirect} />
  }

  const submitHandler = e => {
    e.preventDefault()
    props.onAuth(user.email.value, user.password.value, isSignup)
  }

  const switchAuthMode = () => {
    setIsSignup(!isSignup)
  }

  return (
    <div>
      {redirectAuthorization}
      {errorMessage}
      <form onSubmit={submitHandler}>
        {form}
        <Button btnType="Success">SUBMIT</Button>
      </form>
      <Button btnType="Danger" clicked={switchAuthMode}>
        SWITCH TO {isSignup ? 'SIGNIN' : 'SIGNUP'}
      </Button>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    buildingBurger: state.burgerBuilder.building,
    authRedirect: state.auth.authRedirectPath,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignup) =>
      dispatch(actions.auth(email, password, isSignup)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth)
