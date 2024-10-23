'use client'

import { CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export const showToast = (
  type: 'success' | 'error',
  message: string,
  theme: string | undefined
) => {
  const isSuccess = type === 'success'
  const Icon = isSuccess ? CheckCircle : XCircle

  toast(message, {
    icon: <Icon className={isSuccess ? 'text-green-500' : 'text-red-500'} />,
    style: {
      border:
        theme === 'dark'
          ? isSuccess
            ? '1px solid #5B21B6'
            : '1px solid #B91C1C'
          : isSuccess
            ? '1px solid #D1FAE5'
            : '1px solid #FECACA',
      padding: '16px',
      borderRadius: '8px',
      color:
        theme === 'dark'
          ? isSuccess
            ? '#E9D5FF'
            : '#FCA5A5'
          : isSuccess
            ? '#065F46'
            : '#991B1B',
      backgroundColor:
        theme === 'dark'
          ? isSuccess
            ? '#4C1D95'
            : '#7F1D1D'
          : isSuccess
            ? '#ECFDF5'
            : '#FEF2F2',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    duration: 4000
  })
}
