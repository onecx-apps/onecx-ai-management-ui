import { createReducer, on } from '@ngrx/store'
import { AiKnowledgeBaseDetailsActions } from './ai-knowledge-base-details.actions'
import { AiKnowledgeBaseDetailsState } from './ai-knowledge-base-details.state'

export const initialState: AiKnowledgeBaseDetailsState = {
  details: undefined,
  detailsLoadingIndicator: true,
  detailsLoaded: false,
  editMode: false,
  isSubmitting: false
}

export const aiKnowledgeBaseDetailsReducer = createReducer(
  initialState,
  on(
    AiKnowledgeBaseDetailsActions.aiKnowledgeBaseDetailsReceived,
    (state: AiKnowledgeBaseDetailsState, { details }): AiKnowledgeBaseDetailsState => ({
      ...state,
      details,
      detailsLoadingIndicator: false,
      detailsLoaded: true
    })
  ),
  on(
    AiKnowledgeBaseDetailsActions.aiKnowledgeBaseDetailsLoadingFailed,
    (state: AiKnowledgeBaseDetailsState): AiKnowledgeBaseDetailsState => ({
      ...state,
      details: undefined,
      detailsLoadingIndicator: false,
      detailsLoaded: false
    })
  ),
  on(
    AiKnowledgeBaseDetailsActions.navigatedToDetailsPage,
    (): AiKnowledgeBaseDetailsState => ({
      ...initialState
    })
  ),
  on(
    AiKnowledgeBaseDetailsActions.editButtonClicked,
    (state: AiKnowledgeBaseDetailsState): AiKnowledgeBaseDetailsState => ({
      ...state,
      editMode: true
    })
  ),
  on(
    AiKnowledgeBaseDetailsActions.saveButtonClicked,
    (state: AiKnowledgeBaseDetailsState): AiKnowledgeBaseDetailsState => ({
      ...state,
      isSubmitting: true
    })
  ),
  on(
    AiKnowledgeBaseDetailsActions.cancelEditConfirmClicked,
    AiKnowledgeBaseDetailsActions.cancelEditNotDirty,
    AiKnowledgeBaseDetailsActions.updateAiKnowledgeBaseCancelled,
    AiKnowledgeBaseDetailsActions.updateAiKnowledgeBaseSucceeded,
    (state: AiKnowledgeBaseDetailsState): AiKnowledgeBaseDetailsState => ({
      ...state,
      editMode: false
    })
  ),
  on(
    AiKnowledgeBaseDetailsActions.updateAiKnowledgeBaseFailed,
    (state: AiKnowledgeBaseDetailsState): AiKnowledgeBaseDetailsState => ({
      ...state,
      isSubmitting: false
    })
  )
)
