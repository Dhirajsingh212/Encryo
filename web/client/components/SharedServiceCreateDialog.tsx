'use client'

import { addSharedGithubService } from '@/actions/sharedServices'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { validateLink } from '@/lib/common'
import { showToast } from '@/toast'
import { ServiceForm } from '@/types/types'
import { useAuth } from '@clerk/nextjs'
import { AnimatePresence, motion } from 'framer-motion'
import { PlusSquare } from 'lucide-react'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import CreateServiceForm from './CreateServiceForm'
import { Button } from './ui/button'
import Spinner from './Spinner'

const SharedServiceCreateDialog = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<ServiceForm>({
    name: '',
    value: '',
    date: '',
    link: ''
  })
  const { theme } = useTheme()
  const path = usePathname()
  const { userId } = useAuth()

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: ServiceForm) => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })
  }

  const submitHandler = async () => {
    try {
      setIsLoading(true)
      if (!userId) {
        showToast('error', 'user not logged in', theme)
        return
      }
      if (
        !formData.name.trim() ||
        !formData.value.trim() ||
        !formData.date.trim() ||
        !formData.link.trim()
      ) {
        showToast('error', 'Fields cannot be empty', theme)
        return
      }

      if (!validateLink(formData.link)) {
        showToast('error', 'Link not valid', theme)
        return
      }

      const response = await addSharedGithubService(
        formData,
        path.split('/')[2],
        userId
      )
      if (response) {
        showToast('success', 'Service created successfully', theme)
        setFormData({
          name: '',
          value: '',
          date: '',
          link: ''
        })
      } else {
        showToast('error', 'Failed to create service', theme)
      }
    } catch (err) {
      showToast('error', 'Failed to create file', theme)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='bg-violet-600 text-white hover:bg-violet-700'>
          <PlusSquare className='h-4 w-4 sm:mr-2' />
          <span className='visible max-sm:hidden'>Create a service</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='flex max-h-[90vh] w-[90vw] max-w-4xl flex-col gap-4 overflow-hidden rounded-xl border-none bg-gradient-to-br from-slate-900 to-slate-800 p-0 text-white shadow-2xl max-sm:overflow-y-scroll'>
        <div className='flex flex-col lg:flex-row'>
          <motion.div
            className='flex w-full flex-col p-8'
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AnimatePresence mode='wait'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className='space-y-6'>
                  <h2 className='text-2xl font-bold'>Service details</h2>
                  <CreateServiceForm
                    formData={formData}
                    changeHandler={changeHandler}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
            <div className='mt-8 flex justify-end'>
              <Button
                onClick={submitHandler}
                disabled={isLoading}
                className='bg-violet-600 hover:bg-violet-700'
              >
                {isLoading ? <Spinner /> : 'Submit'}
              </Button>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SharedServiceCreateDialog
