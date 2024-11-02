import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-white px-4 text-center dark:from-gray-900 dark:to-gray-800'>
      <div className='space-y-4'>
        <div className='relative mx-auto h-64 w-64'>
          <div className='absolute inset-0 animate-pulse rounded-full bg-blue-200 dark:bg-blue-900'></div>
          <svg
            className='absolute inset-0 h-full w-full text-blue-500 dark:text-blue-400'
            fill='currentColor'
            viewBox='0 0 100 100'
            preserveAspectRatio='xMidYMid meet'
          >
            <path d='M50 15 L15 85 H85 Z' />
            <circle cx='50' cy='70' r='8' fill='white' />
            <rect x='46' y='30' width='8' height='25' rx='4' fill='white' />
          </svg>
        </div>
        <h1 className='text-4xl font-bold text-gray-800 dark:text-white sm:text-5xl'>
          Oops! Page Not Found
        </h1>
        <p className='text-lg text-gray-600 dark:text-gray-300'>
          We couldn't find the page you're looking for. It might have been moved
          or doesn't exist.
        </p>
        <Link
          href='/'
          className='inline-flex items-center rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        >
          <Home className='mr-2 h-5 w-5' />
          <span>Return Home</span>
        </Link>
      </div>
      <p className='mt-8 text-sm text-gray-500 dark:text-gray-400'>
        Error Code: 404 | Page Not Found
      </p>
    </div>
  )
}
