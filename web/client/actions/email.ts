'use server'
import { EmailTemplate } from '@/components/EmailTemplate'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendEmail = async (email: string, plan: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Encryo <onboarding@resend.dev>',
      to: [`${process.env.ADMIN_EMAIL}`],
      subject: 'Plan upgrade',
      react: EmailTemplate({ email: email, plan: plan })
    })
    if (error) {
      console.log(error)
      return false
    }
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}
