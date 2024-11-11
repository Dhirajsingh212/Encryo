'use server'

import { decryptCLICommand, encryptCLICommand, encryptData } from '@/lib/key'

export async function hashCliCommand({
  userId,
  slug,
  shared
}: {
  userId: string
  slug: string
  shared: boolean
}) {
  try {
    const hashedString = encryptCLICommand(
      JSON.stringify({
        userId: userId,
        slug: slug,
        shared: shared
      }),
      process.env.CLI_SECRET || 'sec3rt'
    )
    return hashedString
  } catch (err) {
    return null
  }
}

export async function decryptCliHash(data: string) {
  try {
    const decryptedData = await decryptCLICommand(
      data,
      process.env.CLI_SECRET || 'sec3rt'
    )
    return JSON.parse(decryptedData)
  } catch (err) {
    return null
  }
}
