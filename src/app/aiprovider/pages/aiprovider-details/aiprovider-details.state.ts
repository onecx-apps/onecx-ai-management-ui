import { AIProvider } from '../../../shared/generated'

export interface AIProviderDetailsState {
  details: AIProvider | undefined,
  editMode: boolean,
  isApiKeyHidden: boolean
}
