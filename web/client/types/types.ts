export type FieldType = 'text' | 'multipleChoice' | 'checkbox' | 'date' | 'file'

export interface Field {
  id: string
  type: FieldType
  label: string
  options?: string[]
}

export interface Form {
  createdAt: Date
  formTitle: string
}

export interface UserForms {
  forms: Form[]
}

export interface ProjectDetails {
  envs: Envs[]
}

export interface Envs {
  value: string
  name: string
  id: string
}

export interface Service {
  id: string
  name: string
  link: string
  value: string
  expDate: string
}

export interface FormData {
  name: string
  extension: string
  content: string
}

export interface GithubFile {
  id: string
  name: string
  encryptedContent: string
  type: string
  extension: string
}
