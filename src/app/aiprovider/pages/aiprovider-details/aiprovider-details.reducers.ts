import { createReducer, on } from '@ngrx/store'
import { AIProviderDetailsActions } from './aiprovider-details.actions'
import { AIProviderDetailsState } from './aiprovider-details.state'

export const initialState: AIProviderDetailsState = {
  details: undefined
}

export const aIProviderDetailsReducer = createReducer(
  initialState,
  on(
    AIProviderDetailsActions.aiproviderDetailsReceived,
    (state: AIProviderDetailsState, { details }): AIProviderDetailsState => ({
      ...state,
      details
    })
  ),
  on(
    AIProviderDetailsActions.aiproviderDetailsLoadingFailed,
    (state: AIProviderDetailsState): AIProviderDetailsState => ({
      ...state,
      details: undefined
    })
  ),
  on(
    AIProviderDetailsActions.navigatedToDetailsPage,
    (): AIProviderDetailsState => ({
      ...initialState
    })
  )
)
