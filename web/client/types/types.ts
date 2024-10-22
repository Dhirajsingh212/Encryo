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
