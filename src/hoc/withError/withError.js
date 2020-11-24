import React, {useState, useEffect} from 'react'
import Modal from '../../components/UI/Modal/Modal'
import Aux from '../Aux/Aux'

const WithError = (WrappedComponent, axios) => {
  const [err, setErr] = useState(null)

  useEffect(() => {
    axios.interceptors.req.use(req => {
      setErr(null)
      return req
    })
    axios.interceptors.res.use(
      res => res,
      err => {
        setErr(err)
      }
    )
  })

  const errorConfirmed = () => {
    setErr(null)
  }

  return props => {
    return (
      <Aux>
        <Modal show={err} modalClosed={errorConfirmed}>
          {err ? err.message : null}
        </Modal>
        <WrappedComponent {...props} />
      </Aux>
    )
  }
}

export default WithError
