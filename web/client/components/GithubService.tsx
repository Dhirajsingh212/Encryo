import { Service } from '@/types/types'
import CreateServiceDialog from './CreateServiceDialog'
import ServiceCard from './ServiceCard'

const GithubService = ({ services }: { services: Service[] }) => {
  return (
    <div>
      <div className='flex flex-row justify-between'>
        <p className='text-xl font-semibold'>Services</p>
        <CreateServiceDialog />
      </div>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {services.length === 0 && <p className='pt-4'>No records found.</p>}
        {services.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  )
}

export default GithubService
