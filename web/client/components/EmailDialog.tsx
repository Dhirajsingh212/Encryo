'use client'

import { sendEmail } from '@/actions/email'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { showToast } from '@/toast'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import Spinner from './Spinner'

export default function EmailDialog({
  btnText,
  highlighted,
  plan
}: {
  btnText: string
  highlighted: boolean
  plan: string
}) {
  const [open, setOpen] = useState(false)
  const [planName, setPlanName] = useState(plan)
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { theme } = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      setIsLoading(true)
      e.preventDefault()

      const response = await sendEmail(email, planName)
      setOpen(false)
      if (response) {
        showToast('success', 'Email sent to admin', theme)
        setPlanName('')
        setEmail('')
      } else {
        showToast('error', 'Failed to send email', theme)
      }
    } catch (err) {
      showToast('error', 'Failed to send email', theme)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className='w-full'
          variant={highlighted ? 'default' : 'outline'}
        >
          {btnText}
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-[280px] rounded-lg border-none bg-slate-950 text-white sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Email Plan Request</DialogTitle>
          <DialogDescription>
            Enter your email plan details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='planName' className='text-right'>
                Plan Name
              </Label>
              <Input
                id='planName'
                value={planName}
                disabled
                className='col-span-3 border-slate-700'
                required
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='message' className='text-right'>
                Email
              </Label>
              <Input
                id='message'
                value={email}
                onChange={e => setEmail(e.target.value)}
                className='col-span-3 border-slate-700'
                placeholder='Enter your email'
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button disabled={isLoading} type='submit'>
              {isLoading ? <Spinner /> : 'Request Plan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
