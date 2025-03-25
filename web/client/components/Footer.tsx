import Link from 'next/link'

const Footer = () => {
  return (
    <footer className='bg-teal-800 py-12 text-white dark:bg-card'>
      <div className='container mx-auto px-6'>
        <div className='flex flex-col items-center justify-between md:flex-row'>
          <div className='mb-4 md:mb-0'>
            © {new Date().getFullYear()} Encryo. All rights reserved.
          </div>
          <div className='flex space-x-6'>
            <Link
              href='/privacy'
              className='transition-colors duration-300 hover:text-cyan-300'
            >
              Privacy Policy
            </Link>
            <Link
              href='/terms'
              className='transition-colors duration-300 hover:text-cyan-300'
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
