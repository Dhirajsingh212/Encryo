import Link from 'next/link'

export default function NavLink({ href, children }: any) {
  return (
    <Link
      href={href}
      className='text-gray-600 transition-colors duration-300 hover:text-teal-600 dark:text-gray-300 dark:hover:text-teal-400'
    >
      {children}
    </Link>
  )
}
