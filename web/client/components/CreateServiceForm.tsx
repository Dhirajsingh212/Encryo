'use client'
import { Input } from './ui/input'
import { Label } from './ui/label'

const CreateServiceForm = ({
  formData,
  changeHandler
}: {
  formData: any
  changeHandler: any
}) => {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-2'>
        <Label>Service name</Label>
        <Input
          name='name'
          value={formData.name}
          onChange={changeHandler}
          placeholder='File name'
          className='border-slate-700 bg-slate-900'
        />
      </div>
      <div className='flex flex-col gap-2'>
        <Label>Api key</Label>
        <Input
          value={formData.value}
          name='value'
          onChange={changeHandler}
          placeholder='File extension'
          className='border-slate-700 bg-slate-900'
        />
      </div>
      <div className='flex flex-col gap-2'>
        <Label>Expiry date</Label>
        <Input
          value={formData.date}
          name='date'
          type='date'
          onChange={changeHandler}
          placeholder='File extension'
          className='border-slate-700 bg-slate-900'
        />
      </div>
      <div className='flex flex-col gap-2'>
        <Label>Link</Label>
        <Input
          value={formData.link}
          name='link'
          onChange={changeHandler}
          className='border-slate-700 bg-slate-900'
          placeholder='File content'
        />
      </div>
    </div>
  )
}

export default CreateServiceForm
