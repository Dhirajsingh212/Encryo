'use client'
import Safari from '@/components/ui/safari'

const Information = () => {
  return (
    <section
      id='demo'
      className='bg-gradient-to-b from-teal-50 to-cyan-100 py-24 dark:from-gray-900 dark:to-blue-900'
    >
      <div className='container mx-auto px-6'>
        <h2 className='mb-12 text-center text-4xl font-bold text-gray-800 dark:text-white'>
          See Encryo in Action
        </h2>
        <div className='flex flex-col items-center lg:flex-row-reverse lg:items-stretch lg:gap-12'>
          <div className='mb-8 w-full lg:mb-0 lg:w-3/5'>
            <div className='relative h-[200px] w-full overflow-hidden rounded-lg transition-transform duration-300 lg:h-[600px] lg:-rotate-2 lg:transform lg:hover:rotate-0'>
              <Safari
                url='Encryo.com'
                className='absolute inset-0 h-full w-full shadow-2xl'
                src='https://i.pinimg.com/originals/df/39/2f/df392fb90619818047bf4f09e0adbc36.gif'
              />
            </div>
          </div>
          <div className='w-full lg:flex lg:w-2/5 lg:flex-col lg:justify-center'>
            <div className='space-y-6 text-center lg:text-left'>
              <h3 className='text-3xl font-bold text-gray-800 dark:text-white'>
                Secure Your API Keys and Secrets with Ease
              </h3>
              <p className='text-lg text-gray-600 dark:text-gray-300'>
                Our solution provides a centralized and secure vault for all
                your sensitive data. Effortlessly manage, rotate, and control
                access to API keys, tokens, and credentials.
              </p>
              <ul className='space-y-2 text-gray-600 dark:text-gray-300'>
                <li className='flex items-center justify-center lg:justify-start'>
                  <svg
                    className='mr-2 h-5 w-5 text-green-500'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                  Centralized secret management
                </li>
                <li className='flex items-center justify-center lg:justify-start'>
                  <svg
                    className='mr-2 h-5 w-5 text-green-500'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                  Automated key rotation
                </li>
                <li className='flex items-center justify-center lg:justify-start'>
                  <svg
                    className='mr-2 h-5 w-5 text-green-500'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                  Role-based access control
                </li>
                <li className='flex items-center justify-center lg:justify-start'>
                  <svg
                    className='mr-2 h-5 w-5 text-green-500'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                  End-to-end encryption
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Information
