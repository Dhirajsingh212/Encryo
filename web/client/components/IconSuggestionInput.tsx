'use client'
import Fuse from 'fuse.js'
import * as FaIcons from 'react-icons/fa'
import * as MdIcons from 'react-icons/md'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { Input } from './ui/input'
import { Separator } from './ui/separator'
import { cn } from '@/lib/utils'

const allIconsObject: any = { ...FaIcons, ...MdIcons }
const allIcons = Object.keys(allIconsObject)

const fuse = new Fuse(allIcons, {
  threshold: 0.3
})

const IconSuggestionInput = ({
  text,
  setText
}: {
  text: string
  setText: (e: string) => void
}) => {
  const [open, setOpen] = useState<boolean>(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [searchText] = useDebounce(text, 400)
  const IconComp = allIconsObject[searchText] || null

  useEffect(() => {
    const filterSuggestions = searchText
      ? fuse.search(searchText).map(result => result.item)
      : allIcons.slice(0, 10)
    setSuggestions(filterSuggestions)
  }, [searchText])

  return (
    <>
      <div className='flex flex-row items-center gap-2'>
        <Input
          value={text}
          onChange={e => {
            setOpen(true)
            setText(e.target.value)
          }}
          placeholder='Search Icons..'
        />
        {IconComp && (
          <IconComp className='size-8 rounded-full border border-slate-50 p-1 shadow-xl' />
        )}
      </div>
      {suggestions.length > 0 && (
        <div
          className={cn(
            'mt-2 max-h-40 overflow-y-scroll rounded-md border bg-gray-700 dark:bg-slate-950',
            {
              hidden: open === false
            }
          )}
        >
          {suggestions.map((tag: string) => {
            const IconValComp = allIconsObject[tag]

            return (
              <div key={tag}>
                <div
                  onClick={() => {
                    setText(tag)
                    setOpen(false)
                    setSuggestions([])
                  }}
                  className='flex cursor-pointer flex-row items-center gap-2 p-2 text-sm hover:bg-gray-400 dark:hover:bg-slate-700'
                >
                  {IconValComp && <IconValComp />}
                  {tag}
                </div>
                <Separator />
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

export default IconSuggestionInput
