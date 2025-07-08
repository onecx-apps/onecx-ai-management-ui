import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ActivatedRoute } from '@angular/router'
import { LetDirective } from '@ngrx/component'
import { Store } from '@ngrx/store'
import { MockStore, provideMockStore } from '@ngrx/store/testing'
import { TranslateService } from '@ngx-translate/core'
import { BreadcrumbService, PortalCoreModule, UserService } from '@onecx/portal-integration-angular'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { AIKnowledgeVectorDbDetailsComponent } from './ai-knowledge-vector-db-details.component'
import { AIKnowledgeVectorDbDetailsHarness } from './ai-knowledge-vector-db-details.harness'
import { AIKnowledgeVectorDbDetailsReducer, initialState } from './ai-knowledge-vector-db-details.reducers'
import { selectAIKnowledgeVectorDbDetailsViewModel } from './ai-knowledge-vector-db-details.selectors'
import { AIKnowledgeVectorDbDetailsViewModel } from './ai-knowledge-vector-db-details.viewmodel'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AIKnowledgeDocumentStatusEnum } from 'src/app/shared/generated'
import { PrimeIcons } from 'primeng/api'
import { of } from 'rxjs'
import { ofType } from '@ngrx/effects'
import { AIKnowledgeVectorDbDetailsActions } from './ai-knowledge-vector-db-details.actions'
import { AIKnowledgeVectorDbDetailsState } from './ai-knowledge-vector-db-details.state'

describe('AIKnowledgeVectorDbDetailsComponent', () => {
  const origAddEventListener = window.addEventListener
  const origPostMessage = window.postMessage

  let listeners: any[] = []
  window.addEventListener = (_type: any, listener: any) => {
    listeners.push(listener)
  }

  window.removeEventListener = (_type: any, listener: any) => {
    listeners = listeners.filter((l) => l !== listener)
  }

  window.postMessage = (m: any) => {
    listeners.forEach((l) =>
      l({
        data: m,
        stopImmediatePropagation: () => {},
        stopPropagation: () => {}
      })
    )
  }

  afterAll(() => {
    window.addEventListener = origAddEventListener
    window.postMessage = origPostMessage
  })

  let component: AIKnowledgeVectorDbDetailsComponent
  let fixture: ComponentFixture<AIKnowledgeVectorDbDetailsComponent>
  let store: MockStore<Store>
  let breadcrumbService: BreadcrumbService
  let AIKnowledgeVectorDbDetails: AIKnowledgeVectorDbDetailsHarness

  const mockActivatedRoute = {
    snapshot: {
      data: {}
    }
  }
  const baseAIKnowledgeVectorDbDetailsViewModel: AIKnowledgeVectorDbDetailsViewModel = {
    details: {
      id: '1',
      name: 'Test name',
      description: 'Test description',
      vdb: 'Test vdb',
      vdbCollection: 'Test vdb collection',
      aiContext: {
        id: 'string',
        appId: 'string',
        name: 'string',
        description: 'string',
        modificationCount: -2147483648,
        modificationUser: 'string',
        creationUser: 'string',
        AIKnowledgeBase: {
          modificationCount: -2147483648,
          id: 'string',
          name: 'string',
          description: 'string',
          aiContext: []
        },
        aIKnowledgeVectorDb: {
          modificationCount: -2147483648,
          id: 'string',
          name: 'string',
          description: 'string',
          vdb: 'string',
          vdbCollection: 'string',
          aiContext: {}
        },
        aIKnowledgeUrl: [
          {
            modificationCount: -2147483648,
            modificationUser: 'string',
            creationUser: 'string',
            id: 'string',
            url: 'string',
            name: 'string',
            description: 'string'
          }
        ],
        aIKnowledgeDbs: [
          {
            modificationCount: -2147483648,
            modificationUser: 'string',
            id: 'string',
            name: 'string',
            description: 'string',
            db: 'string',
            user: 'string',
            pwd: 'string',
            tables: ['string']
          }
        ],
        aIKnowledgeDocuments: [
          {
            modificationCount: -2147483648,
            id: 'string',
            name: 'string',
            documentRefId: 'string',
            status: AIKnowledgeDocumentStatusEnum.New
          }
        ],
        provider: {
          modificationCount: -2147483648,
          id: 'string',
          name: 'string',
          description: 'string',
          llmUrl: 'string',
          appId: 'string',
          modelName: 'string',
          modelVersion: 'string',
          apiKey: 'string'
        }
      }
    },
    contexts: [],
    detailsLoaded: true,
    detailsLoadingIndicator: false,
    contextsLoaded: true,
    contextsLoadingIndicator: false,
    backNavigationPossible: true,
    editMode: false,
    isSubmitting: false
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AIKnowledgeVectorDbDetailsComponent],
      imports: [
        PortalCoreModule,
        LetDirective,
        FormsModule,
        ReactiveFormsModule,
        TranslateTestingModule.withTranslations('en', require('./../../../../assets/i18n/en.json')).withTranslations(
          'de',
          require('./../../../../assets/i18n/de.json')
        ),
        HttpClientTestingModule
      ],
      providers: [
        provideMockStore({
          initialState: { AIKnowledgeVectorDb: { details: initialState, backNavigationPossible: true } }
        }),
        BreadcrumbService,
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents()

    const userService = TestBed.inject(UserService)
    userService.hasPermission = () => true
    const translateService = TestBed.inject(TranslateService)
    translateService.use('en')

    store = TestBed.inject(MockStore)
    store.overrideSelector(selectAIKnowledgeVectorDbDetailsViewModel, baseAIKnowledgeVectorDbDetailsViewModel)
    store.refreshState()

    fixture = TestBed.createComponent(AIKnowledgeVectorDbDetailsComponent)
    component = fixture.componentInstance
    breadcrumbService = TestBed.inject(BreadcrumbService)
    fixture.detectChanges()
    AIKnowledgeVectorDbDetails = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      AIKnowledgeVectorDbDetailsHarness
    )
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should display correct breadcrumbs', async () => {
    jest.spyOn(breadcrumbService, 'setItems')

    component.ngOnInit()
    fixture.detectChanges()

    expect(breadcrumbService.setItems).toHaveBeenCalledTimes(1)
    const pageHeader = await AIKnowledgeVectorDbDetails.getHeader()
    const searchBreadcrumbItem = await pageHeader.getBreadcrumbItem('Details')
    expect(await searchBreadcrumbItem!.getText()).toEqual('Details')
  })

  it('should display translated headers', async () => {
    const pageHeader = await AIKnowledgeVectorDbDetails.getHeader()
    expect(await pageHeader.getHeaderText()).toEqual('AIKnowledgeVectorDb Details')
    expect(await pageHeader.getSubheaderText()).toEqual('Display of AIKnowledgeVectorDb Details')
  })

  it('should have 2 inline actions', async () => {
    const pageHeader = await AIKnowledgeVectorDbDetails.getHeader()
    const inlineActions = await pageHeader.getInlineActionButtons()
    expect(inlineActions.length).toBe(2)

    const backAction = await pageHeader.getInlineActionButtonByLabel('Back')
    expect(backAction).toBeTruthy()

    const editAction = await pageHeader.getInlineActionButtonByLabel('Edit')
    expect(editAction).toBeTruthy()
  })

  it('should navigate back on back button click', async () => {
    jest.spyOn(window.history, 'back')
    const doneFn = jest.fn()

    const pageHeader = await AIKnowledgeVectorDbDetails.getHeader()
    const backAction = await pageHeader.getInlineActionButtonByLabel('Back')
    store.scannedActions$.pipe(ofType(AIKnowledgeVectorDbDetailsActions.navigateBackButtonClicked)).subscribe(() => {
      doneFn()
    })
    await backAction?.click()
    expect(doneFn).toHaveBeenCalledTimes(1)
  })

  it('should display item details in form fields', async () => {
    store.overrideSelector(selectAIKnowledgeVectorDbDetailsViewModel, baseAIKnowledgeVectorDbDetailsViewModel)
    store.refreshState()

    fixture.detectChanges()
    await fixture.whenStable()

    if (!component.formGroup) {
      component.ngOnInit()
      fixture.detectChanges()
      await fixture.whenStable()
    }

    const pageDetails = component.formGroup.value
    expect(pageDetails).toEqual({
      ...baseAIKnowledgeVectorDbDetailsViewModel.details,
      aiContext: component.getContextFormValue(
        baseAIKnowledgeVectorDbDetailsViewModel.details?.aiContext
          ? [baseAIKnowledgeVectorDbDetailsViewModel.details?.aiContext]
          : []
      )[0]
    })
  })

  it('should display item details in page header', async () => {
    component.headerLabels$ = of([
      {
        label: 'first',
        value: 'first value'
      },
      {
        label: 'second',
        value: 'second value'
      },
      {
        label: 'third',
        icon: PrimeIcons.PLUS
      },
      {
        label: 'fourth',
        value: 'fourth value',
        icon: PrimeIcons.QUESTION
      }
    ])

    const pageHeader = await AIKnowledgeVectorDbDetails.getHeader()
    const objectDetails = await pageHeader.getObjectInfos()
    expect(objectDetails.length).toBe(4)

    const firstDetailItem = await pageHeader.getObjectInfoByLabel('first')
    expect(await firstDetailItem?.getLabel()).toEqual('first')
    expect(await firstDetailItem?.getValue()).toEqual('first value')
    expect(await firstDetailItem?.getIcon()).toBeUndefined()

    const secondDetailItem = await pageHeader.getObjectInfoByLabel('second')
    expect(await secondDetailItem?.getLabel()).toEqual('second')
    expect(await secondDetailItem?.getValue()).toEqual('second value')
    expect(await secondDetailItem?.getIcon()).toBeUndefined()

    const thirdDetailItem = await pageHeader.getObjectInfoByLabel('third')
    expect(await thirdDetailItem?.getLabel()).toEqual('third')
    expect(await thirdDetailItem?.getValue()).toEqual('')
    expect(await thirdDetailItem?.getIcon()).toEqual(PrimeIcons.PLUS)

    const fourthDetailItem = await pageHeader.getObjectInfoByLabel('fourth')
    expect(await fourthDetailItem?.getLabel()).toEqual('fourth')
    expect(await fourthDetailItem?.getValue()).toEqual('fourth value')
    expect(await fourthDetailItem?.getIcon()).toEqual(PrimeIcons.QUESTION)
  })

  it('should enable or disable the form based on editMode', async () => {
    const viewModelView = {
      ...baseAIKnowledgeVectorDbDetailsViewModel,
      editMode: false
    }
    store.overrideSelector(selectAIKnowledgeVectorDbDetailsViewModel, viewModelView)
    store.refreshState()
    fixture.detectChanges()
    await fixture.whenStable()
    expect(component.formGroup.disabled).toBeTruthy()

    const viewModelEdit = {
      ...baseAIKnowledgeVectorDbDetailsViewModel,
      editMode: true
    }
    store.overrideSelector(selectAIKnowledgeVectorDbDetailsViewModel, viewModelEdit)
    store.refreshState()
    fixture.detectChanges()
    await fixture.whenStable()
    expect(component.formGroup.enabled).toBeTruthy()
  })

  it('should show the correct actions for edit and view modes', async () => {
    // View mode: editMode = false
    const viewModelView = {
      ...baseAIKnowledgeVectorDbDetailsViewModel,
      editMode: false
    }
    store.overrideSelector(selectAIKnowledgeVectorDbDetailsViewModel, viewModelView)
    store.refreshState()
    fixture.detectChanges()
    await fixture.whenStable()
    let actions: any[] = []
    component.headerActions$.subscribe((a) => (actions = a))
    // In view mode, expect Back and Edit actions to be visible
    const visibleActionsView = actions.filter((a) => a.showCondition)
    const actionLabelsView = visibleActionsView.map((a) => a.labelKey)
    expect(actionLabelsView).toContain('AI_KNOWLEDGE_BASE_DETAILS.GENERAL.BACK')
    expect(actionLabelsView).toContain('AI_KNOWLEDGE_VECTOR_DB_DETAILS.GENERAL.EDIT')
    expect(actionLabelsView).not.toContain('AI_KNOWLEDGE_BASE_DETAILS.GENERAL.SAVE')
    expect(actionLabelsView).not.toContain('AI_KNOWLEDGE_BASE_DETAILS.GENERAL.CANCEL')

    // Edit mode: editMode = true
    const viewModelEdit = {
      ...baseAIKnowledgeVectorDbDetailsViewModel,
      editMode: true
    }
    store.overrideSelector(selectAIKnowledgeVectorDbDetailsViewModel, viewModelEdit)
    store.refreshState()
    fixture.detectChanges()
    await fixture.whenStable()
    actions = []
    component.headerActions$.subscribe((a) => (actions = a))
    // In edit mode, expect Save and Cancel actions to be visible
    const visibleActionsEdit = actions.filter((a) => a.showCondition)
    const actionLabelsEdit = visibleActionsEdit.map((a) => a.labelKey)
    expect(actionLabelsEdit).toContain('AI_KNOWLEDGE_BASE_DETAILS.GENERAL.SAVE')
    expect(actionLabelsEdit).toContain('AI_KNOWLEDGE_BASE_DETAILS.GENERAL.CANCEL')
    expect(actionLabelsEdit).not.toContain('AI_KNOWLEDGE_BASE_DETAILS.GENERAL.BACK')
    expect(actionLabelsEdit).not.toContain('AI_KNOWLEDGE_VECTOR_DB_DETAILS.GENERAL.EDIT')
  })

  it('should dispatch edit action when edit() is called', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch')
    component.edit()
    expect(dispatchSpy).toHaveBeenCalledWith(AIKnowledgeVectorDbDetailsActions.editButtonClicked())
  })

  it('should dispatch navigate back action when goBack() is called', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch')
    component.goBack()
    expect(dispatchSpy).toHaveBeenCalledWith(AIKnowledgeVectorDbDetailsActions.navigateBackButtonClicked())
  })

  it('should dispatch cancel action with dirty state when cancel() is called', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch')
    component.formGroup.markAsDirty()
    component.cancel()
    expect(dispatchSpy).toHaveBeenCalledWith(AIKnowledgeVectorDbDetailsActions.cancelButtonClicked({ dirty: true }))
  })

  it('should dispatch save action with form values when save() is called', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch')
    // Set up form values
    component.formGroup.setValue({
      id: 'id',
      name: 'name',
      description: 'desc',
      vdb: 'vdb',
      vdbCollection: 'coll',
      aiContext: { label: 'context', value: { id: 'test' } }
    })
    component.save()
    expect(dispatchSpy).toHaveBeenCalledWith(
      AIKnowledgeVectorDbDetailsActions.saveButtonClicked({
        details: {
          id: 'id',
          name: 'name',
          description: 'desc',
          vdb: 'vdb',
          vdbCollection: 'coll',
          aiContext: { id: 'test' }
        }
      })
    )
  })

  it('should dispatch delete action when delete() is called', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch')
    component.delete()
    expect(dispatchSpy).toHaveBeenCalledWith(AIKnowledgeVectorDbDetailsActions.deleteButtonClicked())
  })

  it('should call breadcrumbService.setItems on ngOnInit', () => {
    const breadcrumbSpy = jest.spyOn(breadcrumbService, 'setItems')
    component.ngOnInit()
    expect(breadcrumbSpy).toHaveBeenCalledWith([
      {
        titleKey: 'AI_KNOWLEDGE_VECTOR_DB_DETAILS.BREADCRUMB',
        labelKey: 'AI_KNOWLEDGE_VECTOR_DB_DETAILS.BREADCRUMB',
        routerLink: '/ai-knowledge-vector-db'
      }
    ])
  })

  it('should map contexts correctly in getContextFormValue', () => {
    const contexts = [
      { id: '1', name: 'Name1' },
      { id: '2', name: 'Name2' }
    ] as any
    const result = component.getContextFormValue(contexts)
    expect(result).toEqual([
      { label: '1:Name1', value: { id: '1', name: 'Name1' } },
      { label: '2:Name2', value: { id: '2', name: 'Name2' } }
    ])
  })

  it('should execute actionCallback for each header action', () => {
    // Prepare spies for each method
    const editSpy = jest.spyOn(component, 'edit')
    const goBackSpy = jest.spyOn(component, 'goBack')
    const cancelSpy = jest.spyOn(component, 'cancel')
    const saveSpy = jest.spyOn(component, 'save')
    const deleteSpy = jest.spyOn(component, 'delete')

    // Set up view model for both modes
    const viewModelView = {
      ...baseAIKnowledgeVectorDbDetailsViewModel,
      editMode: false
    }
    store.overrideSelector(selectAIKnowledgeVectorDbDetailsViewModel, viewModelView)
    store.refreshState()
    fixture.detectChanges()
    let actions: any[] = []
    component.headerActions$.subscribe((a) => (actions = a))
    // Call actionCallbacks in view mode
    actions.forEach((action) => {
      if (typeof action.actionCallback === 'function') {
        action.actionCallback()
      }
    })
    expect(editSpy).toHaveBeenCalled()
    expect(goBackSpy).toHaveBeenCalled()
    expect(cancelSpy).toHaveBeenCalled()
    expect(saveSpy).toHaveBeenCalled()
    expect(deleteSpy).toHaveBeenCalled()

    // Edit mode
    const viewModelEdit = {
      ...baseAIKnowledgeVectorDbDetailsViewModel,
      editMode: true
    }
    store.overrideSelector(selectAIKnowledgeVectorDbDetailsViewModel, viewModelEdit)
    store.refreshState()
    fixture.detectChanges()
    actions = []
    component.headerActions$.subscribe((a) => (actions = a))
    // Call actionCallbacks in edit mode
    actions.forEach((action) => {
      if (typeof action.actionCallback === 'function') {
        action.actionCallback()
      }
    })
    expect(cancelSpy).toHaveBeenCalled()
    expect(saveSpy).toHaveBeenCalled()
  })

  it('should dispatch cancel action with pristine state when cancel() is called', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch')
    component.formGroup.markAsPristine()
    component.cancel()
    expect(dispatchSpy).toHaveBeenCalledWith(AIKnowledgeVectorDbDetailsActions.cancelButtonClicked({ dirty: false }))
  })

  it('should patch the form with details and matched context', () => {
    const context = { id: 'ctx1', name: 'Context 1' } as any
    const details = { ...baseAIKnowledgeVectorDbDetailsViewModel.details, aiContext: context } as any
    const viewModel = {
      ...baseAIKnowledgeVectorDbDetailsViewModel,
      details,
      editMode: false,
      contexts: [context]
    } as any
    store.overrideSelector(selectAIKnowledgeVectorDbDetailsViewModel, viewModel)
    store.refreshState()
    fixture.detectChanges()
    expect(component.formGroup.value.id).toBe(details.id)
    expect(component.formGroup.value.aiContext.value).toEqual(context)
  })

  it('should emit correct displayContexts$ for details with aiContext', (done) => {
    const context = { value: [{ id: 'ctx1' }], name: 'Context 1' } as any
    const details = { ...baseAIKnowledgeVectorDbDetailsViewModel.details, aiContext: context } as any
    const viewModel = { ...baseAIKnowledgeVectorDbDetailsViewModel, details, contexts: [context] } as any
    store.overrideSelector(selectAIKnowledgeVectorDbDetailsViewModel, viewModel)
    store.refreshState()
    fixture.detectChanges()
    component.displayContexts$.subscribe((contexts) => {
      expect(contexts.length).toBeGreaterThan(0)
      expect(contexts[0].value).toEqual(context)
      done()
    })
  })

  it('should handle missing details gracefully', () => {
    const viewModel = { ...baseAIKnowledgeVectorDbDetailsViewModel, details: undefined } as any
    store.overrideSelector(selectAIKnowledgeVectorDbDetailsViewModel, viewModel)
    store.refreshState()
    fixture.detectChanges()
    expect(component.formGroup.value.id).toBe('')
  })

  it('should handle empty contexts array gracefully', () => {
    const details = { ...baseAIKnowledgeVectorDbDetailsViewModel.details, aiContext: { name: '', value: {} } } as any
    const viewModel = { ...baseAIKnowledgeVectorDbDetailsViewModel, details, contexts: [] } as any
    store.overrideSelector(selectAIKnowledgeVectorDbDetailsViewModel, viewModel)
    store.refreshState()
    fixture.detectChanges()
    expect(component.formGroup.value.aiContext).toStrictEqual({ label: 'undefined:', value: { name: '', value: {} } }) // or whatever default is expected
  })

  describe('AIKnowledgeVectorDbDetailsReducer (integration)', () => {
    it('should return the initial state for an unknown action', () => {
      const action = { type: 'Unknown' } as any
      const state = AIKnowledgeVectorDbDetailsReducer(undefined, action)
      expect(state).toBe(initialState)
    })

    it('should handle aiKnowledgeVectorDbDetailsReceived', () => {
      const details = {
        id: '1',
        name: 'Test',
        description: '',
        aiContext: { id: 'ctx', name: 'Context' },
        vdb: '',
        vdbCollection: '',
        modificationCount: 0
      }
      const action = AIKnowledgeVectorDbDetailsActions.aiKnowledgeVectorDbDetailsReceived({ details })
      const state = AIKnowledgeVectorDbDetailsReducer(initialState, action)
      expect(state.details).toEqual(details)
      expect(state.detailsLoadingIndicator).toBe(false)
      expect(state.detailsLoaded).toBe(true)
    })

    it('should handle aiKnowledgeVectorDbDetailsLoadingFailed', () => {
      const preState: AIKnowledgeVectorDbDetailsState = {
        ...initialState,
        details: {
          id: '2',
          name: 'Old',
          description: '',
          aiContext: { id: 'ctx', name: 'Context' },
          vdb: '',
          vdbCollection: '',
          modificationCount: 0
        },
        detailsLoadingIndicator: true,
        detailsLoaded: true
      }
      const action = AIKnowledgeVectorDbDetailsActions.aiKnowledgeVectorDbDetailsLoadingFailed({ error: null })
      const state = AIKnowledgeVectorDbDetailsReducer(preState, action)
      expect(state.details).toEqual(initialState.details)
      expect(state.detailsLoadingIndicator).toBe(false)
      expect(state.detailsLoaded).toBe(false)
    })

    it('should handle aiKnowledgeVectorDbContextsReceived', () => {
      const contexts = [{ id: 'ctx1', name: 'Context 1' }]
      const action = AIKnowledgeVectorDbDetailsActions.aiKnowledgeVectorDbContextsReceived({ contexts })
      const state = AIKnowledgeVectorDbDetailsReducer(initialState, action)
      expect(state.contexts).toEqual(contexts)
      expect(state.contextsLoadingIndicator).toBe(false)
      expect(state.contextsLoaded).toBe(true)
    })

    it('should handle aiKnowledgeVectorDbContextsLoadingFailed', () => {
      const preState: AIKnowledgeVectorDbDetailsState = {
        ...initialState,
        contexts: [{ id: 'ctx2', name: 'Old Context' }],
        contextsLoadingIndicator: true,
        contextsLoaded: true
      }
      const action = AIKnowledgeVectorDbDetailsActions.aiKnowledgeVectorDbContextsLoadingFailed({ error: null })
      const state = AIKnowledgeVectorDbDetailsReducer(preState, action)
      expect(state.contexts).toEqual(initialState.contexts)
      expect(state.contextsLoadingIndicator).toBe(false)
      expect(state.contextsLoaded).toBe(false)
    })

    it('should handle navigatedToDetailsPage', () => {
      const preState: AIKnowledgeVectorDbDetailsState = {
        ...initialState,
        details: {
          id: '2',
          name: 'Old',
          description: '',
          aiContext: { id: 'ctx', name: 'Context' },
          vdb: '',
          vdbCollection: '',
          modificationCount: 0
        },
        editMode: true
      }
      const action = AIKnowledgeVectorDbDetailsActions.navigatedToDetailsPage({ id: undefined })
      const state = AIKnowledgeVectorDbDetailsReducer(preState, action)
      expect(state).toEqual(initialState)
    })

    it('should handle editButtonClicked', () => {
      const action = AIKnowledgeVectorDbDetailsActions.editButtonClicked()
      const state = AIKnowledgeVectorDbDetailsReducer(initialState, action)
      expect(state.editMode).toBe(true)
    })

    it('should handle saveButtonClicked', () => {
      const details = {
        id: '3',
        name: 'Save',
        description: '',
        aiContext: { id: 'ctx', name: 'Context' },
        vdb: '',
        vdbCollection: '',
        modificationCount: 0
      }
      const action = AIKnowledgeVectorDbDetailsActions.saveButtonClicked({ details })
      const state = AIKnowledgeVectorDbDetailsReducer(initialState, action)
      expect(state.details).toEqual(details)
      expect(state.editMode).toBe(false)
      expect(state.isSubmitting).toBe(true)
    })

    it('should handle navigateBackButtonClicked', () => {
      const action = AIKnowledgeVectorDbDetailsActions.navigateBackButtonClicked()
      const state = AIKnowledgeVectorDbDetailsReducer(initialState, action)
      expect(state).toEqual(initialState)
    })

    it('should handle cancelEditConfirmClicked and related actions', () => {
      const actions = [
        AIKnowledgeVectorDbDetailsActions.cancelEditConfirmClicked(),
        AIKnowledgeVectorDbDetailsActions.cancelEditNotDirty(),
        AIKnowledgeVectorDbDetailsActions.updateAIKnowledgeVectorDbCancelled(),
        AIKnowledgeVectorDbDetailsActions.updateAIKnowledgeVectorDbSucceeded()
      ]
      actions.forEach((action) => {
        const preState: AIKnowledgeVectorDbDetailsState = { ...initialState, editMode: true, isSubmitting: true }
        const state = AIKnowledgeVectorDbDetailsReducer(preState, action)
        expect(state.editMode).toBe(false)
        expect(state.isSubmitting).toBe(false)
      })
    })

    it('should handle updateAIKnowledgeVectorDbFailed', () => {
      const preState: AIKnowledgeVectorDbDetailsState = { ...initialState, isSubmitting: true }
      const action = AIKnowledgeVectorDbDetailsActions.updateAIKnowledgeVectorDbFailed({ error: null })
      const state = AIKnowledgeVectorDbDetailsReducer(preState, action)
      expect(state.isSubmitting).toBe(false)
    })
  })

  describe('AIKnowledgeVectorDbDetails Selectors', () => {
    const baseState: any = {
      details: {
        id: '1',
        name: 'Test',
        aiContext: { id: 'ctx', name: 'Context' },
        vdb: '',
        vdbCollection: '',
        modificationCount: 0
      },
      contexts: [{ id: 'ctx', name: 'Context' }],
      detailsLoaded: true,
      detailsLoadingIndicator: false,
      contextsLoaded: true,
      contextsLoadingIndicator: false,
      backNavigationPossible: true,
      editMode: false,
      isSubmitting: false
    }

    // const rootState = {
    //   aiKnowledgeVectorDbDetails: baseState
    // }

    // it.only('should select all child selectors', () => {
    //   expect(AIKnowledgeVectorDbDetailsSelectors.selectDetails(rootState)).toEqual(baseState.details)
    //   expect(AIKnowledgeVectorDbDetailsSelectors.selectContexts(rootState)).toEqual(baseState.contexts)
    //   expect(AIKnowledgeVectorDbDetailsSelectors.selectDetailsLoaded(rootState)).toBe(true)
    //   expect(AIKnowledgeVectorDbDetailsSelectors.selectEditMode(rootState)).toBe(false)
    // })

    it('should select the full view model', () => {
      const result = selectAIKnowledgeVectorDbDetailsViewModel.projector(
        baseState.details,
        baseState.contexts,
        baseState.detailsLoaded,
        baseState.detailsLoadingIndicator,
        baseState.contextsLoaded,
        baseState.contextsLoadingIndicator,
        true, // backNavigationPossible
        baseState.editMode,
        baseState.isSubmitting
      )

      expect(result).toEqual({
        details: baseState.details,
        contexts: baseState.contexts,
        detailsLoaded: true,
        detailsLoadingIndicator: false,
        contextsLoaded: true,
        contextsLoadingIndicator: false,
        backNavigationPossible: true,
        editMode: false,
        isSubmitting: false
      })
    })

    it('should handle undefined details and empty contexts', () => {
      const result = selectAIKnowledgeVectorDbDetailsViewModel.projector(
        undefined,
        [],
        false,
        true,
        false,
        true,
        false,
        true,
        false
      )
      expect(result.details).toBeUndefined()
      expect(result.contexts).toEqual([])
      expect(result.detailsLoaded).toBe(false)
      expect(result.detailsLoadingIndicator).toBe(true)
    })
  })
})
