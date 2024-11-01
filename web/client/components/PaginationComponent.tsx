'use client'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { Button } from './ui/button'

export function PaginationComponent({
  start,
  end,
  setStart,
  setEnd,
  contentSize
}: {
  start: number
  end: number
  setStart: any
  setEnd: any
  contentSize: number
}) {
  return (
    <>
      <Pagination>
        <PaginationContent>
          <PaginationItem className='cursor-pointer hover:bg-inherit'>
            <Button
              className='bg-inherit p-0 shadow-none hover:bg-inherit'
              disabled={start === 0}
              onClick={() => {
                setStart(start - 20)
                setEnd(end - 20)
              }}
            >
              <PaginationPrevious className='bg-violet-600 text-white shadow-md hover:bg-violet-500 hover:text-white dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800' />
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button variant='outline' className='mx-4'>
              {start / 20 + 1}
            </Button>
          </PaginationItem>
          <PaginationItem className='cursor-pointer hover:bg-inherit'>
            <Button
              className='bg-inherit p-0 shadow-none hover:bg-inherit'
              disabled={end >= contentSize}
              onClick={() => {
                setStart(start + 20)
                setEnd(end + 20)
              }}
            >
              <PaginationNext className='bg-violet-600 text-white shadow-md hover:bg-violet-500 hover:text-white dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800' />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  )
}
