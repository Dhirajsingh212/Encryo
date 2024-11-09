'use client'

import { addFileToGithubProject } from '@/actions/githubFile'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { showToast } from '@/toast'
import { FormData } from '@/types/types'
import { useAuth } from '@clerk/nextjs'
import { AnimatePresence, motion } from 'framer-motion'
import { PlusSquare } from 'lucide-react'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import GithubMultistepForm from './GithubMultistepForm'
import { Button } from './ui/button'
import Spinner from './Spinner'

const steps = ['Step 1', 'Step 2']

const MultiStepDialog = () => {
  const [selectValue, setSelectValue] = useState<string>('')
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    extension: '',
    content: ''
  })
  const { theme } = useTheme()
  const path = usePathname()
  const { userId } = useAuth()

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: FormData) => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })
  }

  const nextStep = () =>
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0))

  const submitHandler = async () => {
    try {
      setIsLoading(true)
      if (!userId) {
        showToast('error', 'user not logged in', theme)
        return
      }
      if (!selectValue.trim()) {
        showToast('error', 'File type is not selected in step 1', theme)
        return
      }
      if (
        !formData.name.trim() ||
        !formData.extension.trim() ||
        !formData.content.trim()
      ) {
        showToast('error', 'Fields cannot be empty in step 2', theme)
        return
      }
      const response = await addFileToGithubProject(
        formData,
        path.split('/')[2],
        userId,
        selectValue
      )
      if (response.success) {
        showToast('success', 'File created successfully', theme)
        setFormData({
          name: '',
          content: '',
          extension: ''
        })
        setSelectValue('')
      } else {
        showToast('error', response.message, theme)
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
          <PlusSquare className='h-4 w-4 lg:mr-2' />
          <span className='visible max-lg:hidden'>Add files</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='flex max-h-[90vh] w-[90vw] max-w-4xl flex-col gap-4 overflow-hidden rounded-xl border-none bg-gradient-to-br from-slate-900 to-slate-800 p-0 text-white shadow-2xl max-sm:overflow-y-scroll'>
        <div className='flex flex-col lg:flex-row'>
          <motion.div
            className='bg-violet-700 p-6 lg:w-1/3'
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ul className='flex flex-row justify-around lg:flex-col lg:space-y-4'>
              {steps.map((step, index) => (
                <motion.li
                  key={step}
                  className={`group cursor-pointer rounded-md px-6 py-3 text-lg font-medium transition-colors duration-300 ${
                    currentStep === index
                      ? 'bg-violet-900 text-white'
                      : 'text-violet-200 hover:bg-violet-800'
                  }`}
                  onClick={() => setCurrentStep(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {step}
                </motion.li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            className='flex w-full flex-col p-8 lg:w-2/3'
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 && (
                  <div className='space-y-6'>
                    <h2 className='text-2xl font-bold'>Select File Type</h2>
                    <Select onValueChange={setSelectValue} required>
                      <SelectTrigger className='w-full bg-slate-700 text-white'>
                        <SelectValue placeholder='Select type of file' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='env'>
                          Environment Variables
                        </SelectItem>
                        <SelectItem value='config'>
                          Configuration File
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {currentStep === 1 && (
                  <div className='space-y-6'>
                    <h2 className='text-2xl font-bold'>Configure File</h2>
                    <GithubMultistepForm
                      formData={formData}
                      setFormData={setFormData}
                      changeHandler={changeHandler}
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            <div className='mt-8 flex justify-between'>
              <Button
                onClick={prevStep}
                disabled={currentStep === 0}
                className='bg-slate-700 hover:bg-slate-600'
              >
                Previous
              </Button>
              {currentStep !== 1 && (
                <Button
                  onClick={nextStep}
                  disabled={currentStep === steps.length - 1}
                  className='bg-violet-600 hover:bg-violet-700'
                >
                  Next
                </Button>
              )}
              {currentStep === 1 && (
                <Button
                  onClick={submitHandler}
                  disabled={isLoading}
                  className='bg-violet-600 hover:bg-violet-700'
                >
                  {isLoading ? <Spinner /> : 'Submit'}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default MultiStepDialog
