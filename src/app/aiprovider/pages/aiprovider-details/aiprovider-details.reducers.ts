import { createReducer, on } from '@ngrx/store'
import { AIProviderDetailsActions } from './aiprovider-details.actions'
import { AIProviderDetailsState } from './aiprovider-details.state'

export const initialState: AIProviderDetailsState = {
  details: undefined,
  editMode: false,
  isApiKeyHidden: true
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
  ),
  on(
    AIProviderDetailsActions.aiproviderDetailsEditModeSet,
    (state: AIProviderDetailsState, {editMode}): AIProviderDetailsState => ({
      ...state,
      editMode
    })
  ),
  on(
    AIProviderDetailsActions.apiKeyVisibilityToggled,
    (state: AIProviderDetailsState): AIProviderDetailsState => ({
      ...state,
      isApiKeyHidden: !state.isApiKeyHidden
    })
  ),
  // on(
  //   AIProviderDetailsActions.apiKeyPermissionSet,
  //   (state: AIProviderDetailsState, {hasApiKeyPermission}): AIProviderDetailsState => ({
  //     ...state,
  //     hasApiKeyPermission: 
  //   })
  // )
)
