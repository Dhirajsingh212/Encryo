'use server'

import { encryptData } from '@/lib/key'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import path from 'path'

export async function bulkUploadToDb(
  formData: any,
  userId: string,
  projectSlug: string
) {
  try {
    const userDetails = await prisma.user.findFirst({
      where: {
        clerkUserId: userId
      }
    })

    if (!userDetails) {
      return {
        message: 'User does not exists',
        success: false
      }
    }

    if (!userDetails.publicKey) {
      return {
        message: 'Public key does not exists',
        success: false
      }
    }

    const projectDetails = await prisma.githubProject.findFirst({
      where: {
        slug: projectSlug
      }
    })

    if (!projectDetails) {
      return {
        message: 'Project does not exists',
        success: false
      }
    }

    const filePromises = []
    let errorCount = 0

    for (const [_, value] of formData.entries()) {
      if (value instanceof File) {
        const extension = path.extname(value.name).toLowerCase()
        if (includedExtensions.includes(extension)) {
          filePromises.push(
            (async () => {
              try {
                // Extract file details
                const name = path.basename(value.name, extension)

                // Read file content as a buffer
                const fileContent = await value.arrayBuffer()

                // Convert ArrayBuffer to Buffer
                const fileBuffer = Buffer.from(fileContent)

                // Convert buffer to string if needed (for text-based files)
                const fileString = fileBuffer.toString()

                // Encrypt file content
                const encryptedContent = await encryptData(
                  fileString,
                  userDetails.publicKey || ''
                )

                // Save file details, including content, to the database
                await prisma.githubFile.create({
                  data: {
                    name: name,
                    extension: extension.slice(1, extension.length),
                    encryptedContent: encryptedContent,
                    type: value.type,
                    projectId: projectDetails.id
                  }
                })
              } catch (error) {
                console.error(`Error processing file ${value.name}:`, error)
                errorCount++
              }
            })()
          )
        }
      }
    }

    await Promise.all(filePromises)
    revalidatePath('/forked(.*)')
    if (errorCount > 0) {
      return {
        message: `${errorCount} files failed to upload`,
        success: false
      }
    }
    return {
      message: 'Files uploaded successfully',
      success: true
    }
  } catch (err) {
    console.log(err)
    return {
      message: 'Something went wrong',
      success: false
    }
  }
}

export async function bulkSharedUploadToDb(
  formData: any,
  userId: string,
  projectSlug: string
) {
  try {
    const projectDetails = await prisma.githubProject.findFirst({
      where: {
        slug: projectSlug
      }
    })

    if (!projectDetails) {
      return {
        message: 'Project does not exists',
        success: false
      }
    }

    const sharedDetails = await prisma.githubShared.findFirst({
      where: {
        userIdTo: userId,
        githubProjectId: projectDetails.id
      }
    })

    if (!sharedDetails) {
      return {
        message: 'User not authorized to access this',
        success: false
      }
    }

    const userDetails = await prisma.user.findFirst({
      where: {
        clerkUserId: sharedDetails.userIdFrom
      }
    })

    if (!userDetails) {
      return {
        message: 'Admin user does not exists',
        success: false
      }
    }

    if (!userDetails.publicKey) {
      return {
        message: 'Admin user public key does not exists',
        success: false
      }
    }

    const filePromises = []
    let errorCount = 0

    for (const [_, value] of formData.entries()) {
      if (value instanceof File) {
        const extension = path.extname(value.name).toLowerCase()
        if (includedExtensions.includes(extension)) {
          filePromises.push(
            (async () => {
              try {
                // Extract file details
                const name = path.basename(value.name, extension)

                // Read file content as a buffer
                const fileContent = await value.arrayBuffer()

                // Convert ArrayBuffer to Buffer
                const fileBuffer = Buffer.from(fileContent)

                // Convert buffer to string if needed (for text-based files)
                const fileString = fileBuffer.toString()

                // Encrypt file content
                const encryptedContent = await encryptData(
                  fileString,
                  userDetails.publicKey || ''
                )

                // Save file details, including content, to the database
                await prisma.githubFile.create({
                  data: {
                    name: name,
                    extension: extension.slice(1, extension.length),
                    encryptedContent: encryptedContent,
                    type: value.type,
                    projectId: projectDetails.id
                  }
                })
              } catch (error) {
                console.error(`Error processing file ${value.name}:`, error)
                errorCount++
              }
            })()
          )
        }
      }
    }

    await Promise.all(filePromises)
    revalidatePath('/forked(.*)')
    if (errorCount > 0) {
      return {
        message: `${errorCount} files failed to upload`,
        success: false
      }
    }
    return {
      message: 'Files uploaded successfully',
      success: true
    }
  } catch (err) {
    console.log(err)
    return {
      message: 'Something went wrong',
      success: false
    }
  }
}

const includedExtensions = [
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.py',
  '.java',
  '.c',
  '.cpp',
  '.cc',
  '.cs',
  '.rb',
  '.php',
  '.swift',
  '.go',
  '.rs',
  '.kt',
  '.kts',
  '.scala',
  '.pl',
  '.pm',
  '.groovy',
  '.dart',
  '.html',
  '.css',
  '.vue',
  '.svelte',
  '.hbs',
  '.txt',
  '.md',
  '.markdown',
  '.json',
  '.xml',
  '.yml',
  '.yaml',
  '.ini',
  '.csv',
  '.log',
  '.env',
  '.config',
  '.conf',
  '.toml',
  '.sh',
  '.bat',
  '.ps1',
  '.makefile',
  '.dockerfile',
  '.gradle',
  '.properties',
  '.tsconfig',
  '.jsconfig',
  '.babelrc',
  '.prettierrc',
  '.eslintrc',
  '.editorconfig',
  '.lock',
  '.npmrc',
  '.yarnrc',
  '.gitignore',
  '.gitattributes',
  '.gitmodules',
  '.dockerignore',
  '.babelignore',
  '.eslintignore',
  '.prettierignore',
  '.tslint',
  '.webpack',
  '.htaccess',
  '.htpasswd',
  '.slugignore',
  '.styl',
  '.scss',
  '.sass',
  '.less',
  '.asp',
  '.aspx',
  '.jsp',
  '.erb',
  '.coffee',
  '.haml',
  '.pug',
  '.mustache',
  '.jinja',
  '.liquid',
  '.rake',
  '.mkd',
  '.rst',
  '.tex',
  '.bib',
  '.scss',
  '.sass',
  '.stylelintrc',
  '.postcssrc',
  '.tf',
  '.tfvars',
  '.nomad',
  '.cue',
  '.j2',
  '.mjml',
  '.blade.php',
  '.twig',
  '.lock',
  '.pom.xml',
  '.build.gradle',
  '.go.mod',
  '.go.sum',
  '.requirements',
  '.gemspec',
  '.jar',
  '.pom',
  '.csproj',
  '.fsproj',
  '.xproj',
  '.vbproj',
  '.plist',
  '.pro',
  '.ipynb',
  '.rmd',
  '.sage',
  '.rproj',
  '.pt',
  '.yaml',
  '.sub',
  '.iss',
  '.d.ts',
  '.cabal',
  '.elm',
  '.hs',
  '.fsharp',
  '.dproj',
  '.dof',
  '.dockerfile',
  '.template',
  '.schema',
  '.blade',
  '.jspf',
  '.spec',
  '.mjs',
  '.cjs',
  '.graphql',
  '.proto',
  '.mdx',
  '.odt',
  '.ods',
  '.odp',
  '.xls',
  '.xlsx',
  '.doc',
  '.docx',
  '.ppt',
  '.pptx'
]
