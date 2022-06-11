import React from 'react'
import { toast } from 'react-toastify'

interface Props {
  type: 'success' | 'info' | 'warning' | 'error'
  message: string
}

const ToastMessage = ({ type, message }: Props) => {
  toast[type](<div>{message}</div>)
}

ToastMessage.dismiss = toast.dismiss

export default ToastMessage
