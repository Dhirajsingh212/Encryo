'use server'
import { subtle } from 'crypto'
import { Buffer } from 'buffer'
import * as crypto from 'crypto'

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
  // Import the RSA public key
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

  // Generate a symmetric AES-GCM key for encrypting the data
  const aesKey = await subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  )

  // Encode the data as Uint8Array and encrypt with AES-GCM
  const encodedData = new TextEncoder().encode(data)
  const iv = crypto.getRandomValues(new Uint8Array(12)) // 12 bytes for AES-GCM IV
  const encryptedData = await subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    aesKey,
    encodedData
  )

  // Export and encrypt the AES key with the RSA public key
  const aesKeyBuffer = await subtle.exportKey('raw', aesKey)
  const encryptedAesKey = await subtle.encrypt(
    { name: 'RSA-OAEP' },
    publicKey,
    aesKeyBuffer
  )

  // Combine IV, encrypted AES key, and encrypted data
  const combined = Buffer.concat([
    Buffer.from(iv),
    Buffer.from(encryptedAesKey),
    Buffer.from(encryptedData)
  ])

  return combined.toString('base64')
}

// Decrypt data with user's private keyexport async function decryptData(
export async function decryptData(
  encryptedData: string,
  privateKeyBase64: string
) {
  // Import the RSA private key
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

  // Decode the base64-encoded input
  const combinedBuffer = Buffer.from(encryptedData, 'base64')

  // Extract the IV, encrypted AES key, and encrypted data
  const iv = combinedBuffer.slice(0, 12) // 12 bytes for the IV
  const encryptedAesKey = combinedBuffer.slice(12, 12 + 256) // Assuming 2048-bit RSA, giving 256 bytes
  const encryptedContent = combinedBuffer.slice(12 + 256)

  // Decrypt the AES key with the RSA private key
  const aesKeyBuffer = await subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    encryptedAesKey
  )

  // Import the decrypted AES key
  const aesKey = await subtle.importKey(
    'raw',
    aesKeyBuffer,
    { name: 'AES-GCM' },
    true,
    ['decrypt']
  )

  // Decrypt the content using AES-GCM
  const decryptedContent = await subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    aesKey,
    encryptedContent
  )

  // Return the decoded plaintext
  return new TextDecoder().decode(decryptedContent)
}

export interface EncryptedVariable {
  id: string
  name: string
  encryptedValue: string
  userId: string
}

function toBase64URL(str: string): string {
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function fromBase64URL(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  const pad = str.length % 4
  if (pad) {
    if (pad === 1) {
      throw new Error('Invalid base64url string')
    }
    str += new Array(5 - pad).join('=')
  }
  return str
}

export async function encryptCLICommand(
  plaintext: string,
  secretKey: string
): Promise<string> {
  const iv = crypto.randomBytes(12)
  const key = crypto
    .createHash('sha256')
    .update(secretKey)
    .digest()
    .slice(0, 32)

  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)

  let encrypted = cipher.update(plaintext, 'utf8')
  encrypted = Buffer.concat([encrypted, cipher.final()])

  const tag = cipher.getAuthTag()

  const combined = Buffer.concat([iv, encrypted, tag])
  const encoded = toBase64URL(combined.toString('base64'))

  return encoded
}

export async function decryptCLICommand(
  encryptedData: string,
  secretKey: string
): Promise<string> {
  try {
    const key = crypto
      .createHash('sha256')
      .update(secretKey)
      .digest()
      .slice(0, 32)

    const combined = Buffer.from(fromBase64URL(encryptedData), 'base64')

    const iv = combined.slice(0, 12)
    const tag = combined.slice(-16)
    const encrypted = combined.slice(12, -16)

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
    decipher.setAuthTag(tag)

    let decrypted = decipher.update(encrypted)
    decrypted = Buffer.concat([decrypted, decipher.final()])

    return decrypted.toString('utf8')
  } catch (error) {
    throw new Error('Decryption failed')
  }
}
