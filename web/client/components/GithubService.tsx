'use client'
import { Service } from '@/types/types'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import CreateServiceDialog from './CreateServiceDialog'
import { PaginationComponent } from './PaginationComponent'
import ServiceCard from './ServiceCard'
import { Search } from 'lucide-react'
import { Input } from './ui/input'

const GithubService = ({ services }: { services: Service[] }) => {
  const [filteredServices, setFilteredServices] = useState(services)
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(20)
  const [text, setText] = useState<string>('')
  const [searchText] = useDebounce(text, 400)

  useEffect(() => {
    setFilteredServices(services)
  }, [services])

  useEffect(() => {
    const filteredData = services.filter(item => {
      return item.name.toLowerCase().includes(searchText.toLowerCase())
    })
    setFilteredServices(filteredData)
  }, [searchText])
  return (
    <div>
      <div className='flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between'>
        <p className='text-2xl font-semibold'>Services</p>
        <div className='flex flex-row gap-2'>
          <CreateServiceDialog />
          <div className='relative w-full'>
            <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 transform text-muted-foreground' />
            <Input
              className='w-full bg-card pl-10 outline-none'
              placeholder='Search services...'
              value={text}
              onChange={e => setText(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className='grid grid-cols-1 gap-4 pt-4 md:grid-cols-2 lg:grid-cols-3'>
        {filteredServices.length === 0 && (
          <p className='pt-4'>No records found.</p>
        )}
        {filteredServices.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
      {filteredServices.length > 20 && (
        <div>
          <PaginationComponent
            start={start}
            end={end}
            setStart={setStart}
            setEnd={setEnd}
            contentSize={filteredServices.length}
          />
        </div>
      )}
    </div>
  )
}

export default GithubService
