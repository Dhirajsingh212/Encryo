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
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            onClick={() => {
              setStart(start - 10)
              setEnd(end - 10)
            }}
          >
            <PaginationPrevious />
          </Button>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='#'>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='#' isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href='#'>3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem className='cursor-pointer hover:bg-inherit'>
          <Button
            onClick={() => {
              setStart(start + 10)
              setEnd(end + 10)
            }}
          >
            <PaginationNext />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
