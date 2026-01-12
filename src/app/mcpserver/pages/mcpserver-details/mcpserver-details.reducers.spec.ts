import { MCPServerDetailsActions } from "./mcpserver-details.actions"
import { mcpserverDetailsReducer, initialState } from "./mcpserver-details.reducers"
import { MCPServerDetailsState } from "./mcpserver-details.state"

describe('MCPServerDetailsReducer', () => {
  it('should set details on mcpserverDetailsReceived', () => {
    const details = { id: '1', name: 'Test' } as any
    const action = MCPServerDetailsActions.mCPServerDetailsReceived({ details })
    const state = mcpserverDetailsReducer(initialState, action)
    expect(state.details).toEqual(details)
  })


  it('should set details to undefined on mcpserverDetailsLoadingFailed', () => {
    const prevState: MCPServerDetailsState = { ...initialState, details: { id: '1' } as any }
    const action = MCPServerDetailsActions.mCPServerDetailsLoadingFailed({ error: null })
    const state = mcpserverDetailsReducer(prevState, action)
    expect(state.details).toBeUndefined()
  })

  it('should reset state on navigatedToDetailsPage', () => {
    const prevState: MCPServerDetailsState = { details: { id: '1' } as any, editMode: true, isApiKeyHidden: false, detailsLoaded: false, detailsLoadingIndicator: false, isSubmitting: false }
    const action = MCPServerDetailsActions.navigatedToDetailsPage({ id: undefined })
    const state = mcpserverDetailsReducer(prevState, action)
    expect(state).toEqual(initialState)
  })


  it('should set editMode on editButtonClicked', () => {
    const action = MCPServerDetailsActions.editButtonClicked()
    const state = mcpserverDetailsReducer(initialState, action)
    expect(state.editMode).toBe(true)
  })

  it('should toggle isApiKeyHidden on apiKeyVisibilityToggled', () => {
    const prevState: MCPServerDetailsState = { ...initialState, isApiKeyHidden: true }
    const action = MCPServerDetailsActions.apiKeyVisibilityToggled()
    const state = mcpserverDetailsReducer(prevState, action)
    expect(state.isApiKeyHidden).toBe(false)
  })
})