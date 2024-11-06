import { Service } from '@/types/types'
import SharedServiceCreateDialog from './SharedServiceCreateDialog'
import SharedWriteAccessServiceCard from './SharedWriteAccessServiceCard'

const SharedGithubWriteAccessService = ({
  services,
  access
}: {
  services: Service[]
  access: string
}) => {
  return (
    <div>
      <div className='flex flex-row items-center justify-between'>
        <p className='text-2xl font-semibold'>Services</p>
        {access === 'write' && <SharedServiceCreateDialog />}
      </div>
      <div className='grid grid-cols-1 gap-4 pt-4 md:grid-cols-2 lg:grid-cols-3'>
        {services.length === 0 && <p className='pt-4'>No records found.</p>}
        {services.map(service => (
          <SharedWriteAccessServiceCard
            key={service.id}
            service={service}
            access={access}
          />
        ))}
      </div>
    </div>
  )
}

export default SharedGithubWriteAccessService
