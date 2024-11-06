'use client'

import { Button } from '@/components/ui/button'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import NavLink from './NavLink'
import { useEffect, useState } from 'react'

const Header = () => {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <header className='container mx-auto px-6 py-4'>
      <nav className='flex items-center justify-between'>
        <Link
          href='/'
          className='bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-3xl font-extrabold text-transparent dark:from-teal-200 dark:to-cyan-400'
        >
          Encyro
        </Link>
        <div className='hidden space-x-6 md:flex'>
          <NavLink href='#features'>Features</NavLink>
          <NavLink href='#demo'>Demo</NavLink>
          <NavLink href='#pricing'>Pricing</NavLink>
        </div>
        <div className='flex items-center space-x-4'>
          <Button
            onClick={() => {
              setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
            }}
            variant='outline'
            size='icon'
            className='rounded-full'
          >
            {resolvedTheme === 'light' ? '🌙' : '☀️'}
          </Button>
          <SignedOut>
            <Button className='bg-slate-900 text-white hover:bg-slate-700'>
              <SignInButton />
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <Button asChild className='visible max-md:hidden'>
            <Link href='/forked'>Get Started</Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}

export default Header
