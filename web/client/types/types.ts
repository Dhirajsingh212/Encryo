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

export interface ServiceForm {
  name: string
  value: string
  date: string
  link: string
}

export interface Service {
  name: string
  value: string
  expDate: string
  link: string
  id: string
}
