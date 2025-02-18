import { AIProvider } from '../../../shared/generated'

export interface AIProviderDetailsViewModel {
  details: AIProvider | undefined,
  editMode: boolean,
  isApiKeyHidden: boolean
}
