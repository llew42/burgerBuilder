import React, {useEffect} from 'react'
import * as actions from '../../../store/actions/index'
import {Redirect} from 'react-router-dom'
import {useDispatch} from 'react-redux'

const Logout = () => {
  const dispatch = useDispatch(actions.logout())
  useEffect(() => {
    dispatch(actions.logout())
  }, [dispatch])

  return <Redirect to="/" />
}

export default Logout
