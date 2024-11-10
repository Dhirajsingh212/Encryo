import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Check } from 'lucide-react'
import EmailDialog from './EmailDialog'

interface PricingCardProps {
  title: string
  price: string
  features: string[]
  btnText: string
  highlighted: boolean
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  features,
  btnText,
  highlighted
}) => {
  return (
    <Card
      className={`w-full max-w-sm transition-all duration-300 ${
        highlighted ? 'scale-105 shadow-xl' : 'hover:scale-105'
      }`}
    >
      <CardHeader>
        <CardTitle className='text-center text-2xl font-bold'>
          {title}
        </CardTitle>
        <div className='text-center'>
          <span className='text-4xl font-bold'>{price}</span>
          {price !== 'Custom' && (
            <span className='text-sm font-medium text-muted-foreground'>
              /month
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ul className='space-y-2'>
          {features.map((feature, index) => (
            <li key={index} className='flex items-center'>
              <Check className='mr-2 h-4 w-4 text-primary' />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <EmailDialog btnText={btnText} highlighted={highlighted} plan={title} />
      </CardFooter>
    </Card>
  )
}

export default function Pricing() {
  return (
    <section id='pricing' className='bg-background py-40 lg:px-20'>
      <div className='container mx-auto px-4 md:px-6'>
        <h2 className='mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl'>
          Choose Your Wave
        </h2>
        <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
          <PricingCard
            title='Basic'
            price='Free'
            features={[
              'Create 5 Projects',
              'Store Unlimited Envs',
              'Add Team Members'
            ]}
            btnText='Start Small'
            highlighted={false}
          />
          <PricingCard
            title='Pro'
            price='$10'
            features={[
              'Create up to 10 Projects',
              'Unlimited Environment Variables',
              'Role-based Access Control'
            ]}
            btnText='Make Waves'
            highlighted={true}
          />
          <PricingCard
            title='Enterprise'
            price='Custom'
            features={[
              'Unlimited Projects',
              'Store Unlimited Envs',
              'Add Team Members'
            ]}
            btnText='Contact Us'
            highlighted={false}
          />
        </div>
      </div>
    </section>
  )
}
