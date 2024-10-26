'use server'
import { subtle } from 'crypto'
import { Buffer } from 'buffer'

// Generate a key pair for the user
export async function generateKeyPair() {
  const keyPair = await subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'
    },
    true,
    ['encrypt', 'decrypt']
  )

  const publicKey = await subtle.exportKey('spki', keyPair.publicKey)
  const privateKey = await subtle.exportKey('pkcs8', keyPair.privateKey)

  return {
    publicKey: Buffer.from(publicKey).toString('base64'),
    privateKey: Buffer.from(privateKey).toString('base64')
  }
}

// Encrypt data with user's public key
export async function encryptData(data: string, publicKeyBase64: string) {
  const publicKey = await subtle.importKey(
    'spki',
    Buffer.from(publicKeyBase64, 'base64'),
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256'
    },
    true,
    ['encrypt']
  )

  const encoded = new TextEncoder().encode(data)
  const encrypted = await subtle.encrypt(
    { name: 'RSA-OAEP' },
    publicKey,
    encoded
  )

  return Buffer.from(encrypted).toString('base64')
}

// Decrypt data with user's private key
export async function decryptData(
  encryptedData: string,
  privateKeyBase64: string
) {
  const privateKey = await subtle.importKey(
    'pkcs8',
    Buffer.from(privateKeyBase64, 'base64'),
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256'
    },
    true,
    ['decrypt']
  )

  const decrypted = await subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    Buffer.from(encryptedData, 'base64')
  )

  return new TextDecoder().decode(decrypted)
}

export interface EncryptedVariable {
  id: string
  name: string
  encryptedValue: string
  userId: string
}
