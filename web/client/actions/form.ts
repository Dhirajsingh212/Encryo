'use server'
import prisma from '@/lib/prisma'
import { Field, UserForms } from '@/types/types'

export async function saveFieldsToDB(
  fields: Field[],
  formTitle: string,
  userId: string
) {
  try {
    await prisma.$transaction(async prisma => {
      const user = await prisma.user.findFirst({
        where: {
          clerkUserId: userId
        }
      })

      if (!user) {
        return
      }

      const formDetails = await prisma.form.create({
        data: {
          formTitle,
          userId: user.id
        }
      })

      for (const field of fields) {
        const savedField = await prisma.field.create({
          data: {
            formId: formDetails.id,
            type: field.type,
            label: field.label
          }
        })

        if (
          field.options &&
          (field.type === 'multipleChoice' || field.type === 'checkbox')
        ) {
          for (const optionValue of field.options) {
            await prisma.option.create({
              data: {
                fieldId: savedField.id,
                value: optionValue
              }
            })
          }
        }
      }
    })
  } catch (err) {
    console.log(err)
  }
}

export async function getUserForms(userId: string): Promise<UserForms | null> {
  try {
    const userForms = await prisma.user.findFirst({
      where: {
        clerkUserId: userId
      },
      select: {
        forms: {
          select: {
            formTitle: true,
            createdAt: true
          }
        }
      }
    })
    return userForms
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function getSingleFormById(formId: string): Promise<any> {
  try {
    const singleFormDetails = await prisma.form.findFirst({
      where: {
        id: formId
      },
      select: {
        formTitle: true,
        createdAt: true,
        fields: {
          select: {
            label: true,
            type: true,
            options: {
              select: {
                value: true
              }
            }
          }
        }
      }
    })
    return singleFormDetails
  } catch (err) {
    console.log(err)
    return null
  }
}
