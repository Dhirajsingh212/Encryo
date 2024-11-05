'use client'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusSquare } from 'lucide-react'
import { useState } from 'react'
import CreateConfigDialog from './CreateConfigDialog'
import GithubCreateEnvDialog from './GithubCreateEnvDialog'
import { Button } from './ui/button'

const steps = ['Step 1', 'Step 2']

const MultiStepDialog = () => {
  const [selectValue, setSelectValue] = useState<string>('')
  const [currentStep, setCurrentStep] = useState(0)

  const nextStep = () =>
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0))

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='bg-violet-600 text-white hover:bg-violet-700'>
          <PlusSquare className='mr-2 h-4 w-4' />
          Add files
        </Button>
      </DialogTrigger>
      <DialogContent className='flex max-h-[90vh] w-[90vw] max-w-4xl flex-col gap-4 overflow-hidden rounded-xl border-none bg-gradient-to-br from-slate-900 to-slate-800 p-0 text-white shadow-2xl'>
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
                    <Select onValueChange={setSelectValue}>
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
                    {selectValue === 'env' && <GithubCreateEnvDialog />}
                    {selectValue === 'config' && <CreateConfigDialog />}
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
              <Button
                onClick={nextStep}
                disabled={currentStep === steps.length - 1}
                className='bg-violet-600 hover:bg-violet-700'
              >
                Next
              </Button>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default MultiStepDialog
