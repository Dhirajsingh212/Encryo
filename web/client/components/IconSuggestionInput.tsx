'use client'

import * as LucideIcons from 'lucide-react'
import { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'

const allIcons: string[] = Object.keys(LucideIcons)

console.log(allIcons)

const IconSuggestionInput = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [text, setText] = useState<string>('')

  return (
    <>
      <Input
        value={text}
        onChange={e => {
          setText(e.target.value)
        }}
        placeholder='Search Icons..'
      />
      <ScrollArea className='mt-2 h-40 rounded-md border bg-gray-700 dark:bg-slate-950'>
        {allIcons.slice(0, 10).map((tag: string, index: number) => {
          const IconComponent = (LucideIcons as any)[tag]

          console.log(IconComponent.$$typeof)
          return (
            <div key={tag}>
              <div className='flex flex-row items-center gap-2 p-2 text-sm hover:bg-gray-400 dark:hover:bg-slate-700'>
                {IconComponent.render ? (
                  <IconComponent className='size-4' />
                ) : null}
                {tag}
              </div>
              <Separator className='' />
            </div>
          )
        })}
      </ScrollArea>
    </>
  )
}

export default IconSuggestionInput
