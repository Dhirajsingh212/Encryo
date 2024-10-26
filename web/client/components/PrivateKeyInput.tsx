'use client'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Input } from './ui/input'

const PrivateKeyInput = () => {
  const [value, setValue] = useLocalStorage('Encryo_private_key', '')
  return (
    <Input
      placeholder='Private key'
      className='bg-card dark:bg-neutral-900'
      disabled
      value={value}
    />
  )
}

export default PrivateKeyInput
