'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const Contact = () => {
  return (
    <section
      id='contact'
      className='bg-gradient-to-b from-teal-50 to-cyan-100 py-24 dark:from-gray-900 dark:to-blue-900'
    >
      <div className='container mx-auto px-6'>
        <h2 className='mb-12 text-center text-4xl font-bold text-gray-800 dark:text-white'>
          Drop Us a Line
        </h2>
        <Card className='mx-auto max-w-lg'>
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
          </CardHeader>
          <CardContent>
            <form className='space-y-4'>
              <div>
                <label
                  htmlFor='name'
                  className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  Name
                </label>
                <Input id='name' name='name' required />
              </div>
              <div>
                <label
                  htmlFor='email'
                  className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  Email
                </label>
                <Input type='email' id='email' name='email' required />
              </div>
              <div>
                <label
                  htmlFor='message'
                  className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  Message
                </label>
                <Textarea id='message' name='message' rows={4} required />
              </div>
              <Button
                type='submit'
                className='w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700'
              >
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default Contact
