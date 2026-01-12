import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { HttpResponse } from '@angular/common/http'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ActivatedRoute, ActivatedRouteSnapshot, EventType, Router } from '@angular/router'
import { LetDirective } from '@ngrx/component'
import { ofType } from '@ngrx/effects'
import { provideMockActions } from '@ngrx/effects/testing'
import { routerNavigatedAction } from '@ngrx/router-store'
import { Store } from '@ngrx/store'
import { MockStore, provideMockStore } from '@ngrx/store/testing'
import { TranslateService } from '@ngx-translate/core'
import { provideUserServiceMock } from '@onecx/angular-integration-interface/mocks'
import {
  AlwaysGrantPermissionChecker,
  BreadcrumbService,
  HAS_PERMISSION_CHECKER,
  PortalCoreModule,
  PortalDialogService,
  PortalMessageService,
  UserService
} from '@onecx/portal-integration-angular'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { PrimeIcons } from 'primeng/api'
import { AutoCompleteModule } from 'primeng/autocomplete'
import { InputTextModule } from 'primeng/inputtext'
import { MultiSelectModule } from 'primeng/multiselect'
import { ReplaySubject, of, throwError } from 'rxjs'
import {
  AIContext,
  AIContextBffService,
  AIProviderBffService,
  GetAIContextByIdResponse,
  MCPServer,
  MCPServerBffService,
  SearchMCPServerResponse,
  UpdateAIContextResponse,
} from 'src/app/shared/generated'
import { selectBackNavigationPossible } from 'src/app/shared/selectors/onecx.selectors'
import { selectRouteParam } from 'src/app/shared/selectors/router.selectors'
import { AiContextDetailsActions } from './ai-context-details.actions'
import { AiContextDetailsComponent } from './ai-context-details.component'
import { AiContextDetailsEffects } from './ai-context-details.effects'
import { AiContextDetailsHarness } from './ai-context-details.harness'
import { aiContextDetailsReducer, initialState } from './ai-context-details.reducers'
import { aiContextDetailsSelectors, selectAiContextDetailsViewModel } from './ai-context-details.selectors'
import { AiContextDetailsState } from './ai-context-details.state'
import { AiContextDetailsViewModel } from './ai-context-details.viewmodel'

describe('AiContextDetailsComponent', () => {
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
        stopImmediatePropagation: () => { },
        stopPropagation: () => { }
      })
    )
  }

  const mockActivatedRoute = {
    snapshot: {
      data: {}
    }
  }

  afterAll(() => {
    window.addEventListener = origAddEventListener
    window.postMessage = origPostMessage
  })

  let component: AiContextDetailsComponent
  let fixture: ComponentFixture<AiContextDetailsComponent>
  let store: MockStore<Store>
  let breadcrumbService: BreadcrumbService
  let AiContextDetails: AiContextDetailsHarness
  let effects: AiContextDetailsEffects
  let actions$: ReplaySubject<any>
  let aiContextService: jest.Mocked<AIContextBffService>
  let aiProviderService: jest.Mocked<AIProviderBffService>
  let mcpServerService: jest.Mocked<MCPServerBffService>
  let portalDialogService: jest.Mocked<PortalDialogService>
  let messageService: jest.Mocked<PortalMessageService>
  let router: jest.Mocked<Router>

  const baseAiContextDetailsViewModel: AiContextDetailsViewModel = {
    details: {
      id: 'id-1',
      appId: 'appid-1',
      name: 'details name',
      description: 'details description',
      modificationCount: 1,
      modificationUser: 'user-1',
      creationUser: 'user-1',
      mcpServers: [{
        modificationCount: 1,
        id: 'id-1',
        name: 'name-1',
        description: 'description-1',
        aiContext: {}
      }],
      provider: {
        modificationCount: 1,
        id: 'id-1',
        name: 'name-1',
        description: 'description-1',
        llmUrl: 'llmUrl-1',
        appId: 'appId-1',
        modelName: 'modelName-1',
        modelVersion: 'modelVersion-1',
        apiKey: 'apiKey-1'
      }
    },
    detailsLoaded: true,
    detailsLoadingIndicator: false,
    aiProviders: [
      {
        modificationCount: 1,
        id: 'id-1',
        name: 'aIProvider name',
        description: 'aIProvider description',
        llmUrl: 'aIProvider llmUrl',
        appId: 'aIProvider appId',
        modelName: 'aIProvider modelName',
        modelVersion: 'aIProvider modelVersion',
        apiKey: 'aIProvider apiKey'
      }
    ],
    aiProvidersLoaded: true,
    aiProvidersLoadingIndicator: false,
    MCPServers: [
      {
        modificationCount: 1,
        id: 'id-1',
        name: 'MCPServer name',
        description: 'MCPServer description',
        aiContext: {}
      }
    ],
    MCPServersLoaded: true,
    MCPServersLoadingIndicator: false,
    backNavigationPossible: true,
    editMode: false,
    isSubmitting: false
  }

  beforeEach(async () => {
    actions$ = new ReplaySubject(1)
    aiContextService = {
      getAIContextById: jest.fn(),
      updateAIContext: jest.fn(),
      deleteAIContext: jest.fn(),
      searchAIContexts: jest.fn()
    } as unknown as jest.Mocked<AIContextBffService>

    aiProviderService = {
      searchAIProvider: jest.fn()
    } as unknown as jest.Mocked<AIProviderBffService>

    mcpServerService = {
      searchMCPServers: jest.fn()
    } as unknown as jest.Mocked<MCPServerBffService>

    portalDialogService = {
      openDialog: jest.fn()
    } as unknown as jest.Mocked<PortalDialogService>

    const mockId = '123'
    router = {
      events: of(),
      navigate: jest.fn().mockReturnValue(Promise.resolve(true)),
      parseUrl: jest.fn().mockImplementation((url: string) => ({
        queryParams: {},
        fragment: null,
        toString: () => url,
        url
      })),
      createUrlTree: jest.fn().mockImplementation((commands: any[]) => ({
        toString: () => commands.join('/')
      })),
      isActive: jest.fn(),
      serializeUrl: jest.fn().mockImplementation((urlTree: any) => urlTree.toString()),
      routerState: {
        root: {
          component: AiContextDetailsComponent,
          firstChild: {
            component: AiContextDetailsComponent,
            paramMap: new Map([['id', mockId]]),
            url: '',
            urlSegments: [],
            outlet: 'primary',
            params: {},
            queryParams: {},
            fragment: null,
            data: {},
            children: []
          }
        },
        snapshot: {
          url: '',
          root: {
            component: AiContextDetailsComponent,
            firstChild: {
              component: AiContextDetailsComponent,
              paramMap: new Map([['id', mockId]]),
              url: '',
              urlSegments: [],
              outlet: 'primary',
              params: {},
              queryParams: {},
              fragment: null,
              data: {},
              children: []
            }
          }
        }
      }
    } as unknown as jest.Mocked<Router>

    messageService = {
      success: jest.fn(),
      error: jest.fn()
    } as unknown as jest.Mocked<PortalMessageService>

    await TestBed.configureTestingModule({
      declarations: [AiContextDetailsComponent],
      imports: [
        PortalCoreModule,
        LetDirective,
        FormsModule,
        ReactiveFormsModule,
        AutoCompleteModule,
        MultiSelectModule,
        InputTextModule,
        TranslateTestingModule.withTranslations('en', require('./../../../../assets/i18n/en.json')).withTranslations(
          'de',
          require('./../../../../assets/i18n/de.json')
        )
      ],
      providers: [
        AiContextDetailsEffects,
        provideMockStore({
          initialState: { AiContext: { details: initialState, backNavigationPossible: true } }
        }),
        provideMockActions(() => actions$),
        provideUserServiceMock(),
        {
          provide: HAS_PERMISSION_CHECKER,
          useClass: AlwaysGrantPermissionChecker
        },
        BreadcrumbService,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AIContextBffService, useValue: aiContextService },
        { provide: AIProviderBffService, useValue: aiProviderService },
        { provide: MCPServerBffService, useValue: mcpServerService },
        { provide: Router, useValue: router },
        { provide: PortalMessageService, useValue: messageService },
        { provide: PortalDialogService, useValue: portalDialogService }
      ]
    }).compileComponents()

    effects = TestBed.inject(AiContextDetailsEffects)
    effects.displayError$.subscribe()

    const userService = TestBed.inject(UserService)
    userService.hasPermission = () => true
    const translateService = TestBed.inject(TranslateService)
    translateService.use('en')

    store = TestBed.inject(MockStore)
    store.overrideSelector(selectAiContextDetailsViewModel, baseAiContextDetailsViewModel)
    store.refreshState()

    fixture = TestBed.createComponent(AiContextDetailsComponent)
    component = fixture.componentInstance
    breadcrumbService = TestBed.inject(BreadcrumbService)
    fixture.detectChanges()
    AiContextDetails = await TestbedHarnessEnvironment.harnessForFixture(fixture, AiContextDetailsHarness)
  })

  describe('AiContextDetailsEffects', () => {
    describe('saveButtonClicked$', () => {
      it('should handle saveButtonClicked$ and dispatch saveAiContextSucceeded on success', (done) => {
        const details = { id: '123', name: 'Test DB' }
        const res = new HttpResponse<UpdateAIContextResponse>({
          body: { dataObject: { name: 'updated name' } },
          status: 200
        })

        aiContextService.updateAIContext.mockReturnValue(of(res))

        store.overrideSelector(aiContextDetailsSelectors.selectDetails, {
          id: '123',
          name: 'Original Name'
        })
        store.refreshState()

        actions$.next(AiContextDetailsActions.saveButtonClicked({ details }))

        effects.saveButtonClicked$.subscribe((action) => {
          expect(action).toEqual(AiContextDetailsActions.updateAiContextSucceeded())
          done()
        })
      })

      it('should handle saveButtonClicked$ and dispatch saveAiContextFailed on error', (done) => {
        const details = { id: '123', name: 'Test DB' }
        const error = 'Save failed'

        aiContextService.updateAIContext.mockReturnValue(throwError(() => error))
        actions$.next(AiContextDetailsActions.saveButtonClicked({ details }))

        effects.saveButtonClicked$.subscribe((action) => {
          expect(action).toEqual(AiContextDetailsActions.updateAiContextFailed({ error }))
          done()
        })
      })

      it('should handle saveButtonClicked$ with undefined itemToEditId and dispatch updateAiContextCancelled', (done) => {
        const details = { name: 'Test DB' } as any
        store.overrideSelector(aiContextDetailsSelectors.selectDetails, details)
        store.refreshState()

        actions$.next(AiContextDetailsActions.saveButtonClicked({ details: { name: 'Updated Name' } } as any))

        effects.saveButtonClicked$.subscribe((action) => {
          expect(action).toEqual(AiContextDetailsActions.updateAiContextCancelled())
          done()
        })
      })

      it('should handle saveButtonClicked$ and dispatch updateAiContextCancelled on success if details is undefined', (done) => {
        const details = { id: '123', name: 'Test DB' }
        const error = 'Update failed'

        store.overrideSelector(aiContextDetailsSelectors.selectDetails, undefined)
        store.refreshState()

        aiContextService.deleteAIContext.mockReturnValue(throwError(() => error))

        actions$.next(AiContextDetailsActions.saveButtonClicked({ details }))

        effects.saveButtonClicked$.subscribe((action) => {
          expect(action).toEqual(AiContextDetailsActions.updateAiContextCancelled())
          done()
        })
      })
    })

    describe('deleteButtonClicked$', () => {
      it('should handle deleteButtonClicked$ and dispatch deleteAiContextSucceeded on success', (done) => {
        const res = new HttpResponse({ status: 204 })
        const details = { id: '123', name: 'Test Item', description: 'Test Description' }

        store.overrideSelector(aiContextDetailsSelectors.selectDetails, details)
        store.refreshState()

        portalDialogService.openDialog.mockReturnValue(
          of({
            button: 'primary',
            data: details,
            result: []
          })
        )

        aiContextService.deleteAIContext.mockReturnValue(of(res))
        actions$.next(AiContextDetailsActions.deleteButtonClicked())

        effects.deleteButtonClicked$.subscribe((action) => {
          expect(action).toEqual(AiContextDetailsActions.deleteAiContextSucceeded())
          done()
        })
      })

      it('should handle deleteButtonClicked$ and dispatch deleteAiContextFailed on error', (done) => {
        const error = 'Delete failed'
        const mockItemToDelete = {
          id: '123',
          name: 'Test Item',
          description: 'Test Description'
        }

        portalDialogService.openDialog.mockReturnValue(
          of({
            button: 'primary',
            data: mockItemToDelete,
            result: []
          })
        )
        aiContextService.deleteAIContext.mockReturnValue(throwError(() => error))

        store.overrideSelector(aiContextDetailsSelectors.selectDetails, mockItemToDelete)
        store.refreshState()

        actions$.next(AiContextDetailsActions.deleteButtonClicked())

        effects.deleteButtonClicked$.subscribe((action) => {
          expect(action).toEqual(AiContextDetailsActions.deleteAiContextFailed({ error }))
          done()
        })
      })

      it('should handle deleteButtonClicked$ and dispatch deleteAiContextCancelled on cancel', (done) => {
        const mockItemToDelete = {
          id: '123',
          name: 'Test Item',
          description: 'Test Description'
        }

        portalDialogService.openDialog.mockReturnValue(
          of({
            button: 'secondary',
            data: mockItemToDelete,
            result: []
          })
        )
        store.overrideSelector(aiContextDetailsSelectors.selectDetails, mockItemToDelete)
        store.refreshState()

        actions$.next(AiContextDetailsActions.deleteButtonClicked())

        effects.deleteButtonClicked$.subscribe((action) => {
          expect(action).toEqual(AiContextDetailsActions.deleteAiContextCancelled())
          done()
        })
      })

      it('should handle deleteButtonClicked$ and throw an error on item not found', (done) => {
        const mockItemToDelete = undefined

        portalDialogService.openDialog.mockReturnValue(
          of({
            button: 'primary',
            data: mockItemToDelete,
            result: []
          })
        )
        store.overrideSelector(aiContextDetailsSelectors.selectDetails, mockItemToDelete)
        store.refreshState()

        actions$.next(AiContextDetailsActions.deleteButtonClicked())

        effects.deleteButtonClicked$.subscribe({
          next: () => {
            fail('Expected error to be thrown')
          },
          error: (err) => {
            expect(err.message).toBe('Item to delete or its ID not found!')
            done()
          }
        })
      })

      it('should navigate to parent route on delete success', (done) => {
        const mockUrl = '/some/path/to/item'
        const expectedUrl = '/some/path'

        router.navigate = jest.fn()
        store.select = jest.fn().mockReturnValue(of(mockUrl))

        actions$.next(AiContextDetailsActions.deleteAiContextSucceeded())

        effects.deleteAiContextSucceeded$.subscribe(() => {
          expect(router.navigate).toHaveBeenCalledWith([expectedUrl])
          done()
        })
      })
    })

    describe('navigatedToDetailsPage$', () => {
      it('should dispatch navigatedToDetailsPage with id', (done) => {
        const mockId = '123'
        const mockAction = routerNavigatedAction({
          payload: {
            event: {
              urlAfterRedirects: '',
              type: EventType.NavigationEnd,
              id: 0,
              url: ''
            },
            routerState: {
              root: new ActivatedRouteSnapshot(),
              url: ''
            }
          }
        })

        store.overrideSelector(selectRouteParam('id'), mockId)
        store.refreshState()

        actions$.next(mockAction)
        effects.navigatedToDetailsPage$.subscribe((action) => {
          expect(action.type).toEqual(AiContextDetailsActions.navigatedToDetailsPage({ id: mockId }).type)
          done()
        })
      })
    })

    describe('searchMCPServers$', () => {
      it('should dispatch aiContextDetailsReceived on successful loadItemById$', (done) => {
        const details = { id: '123' }
        const res = new HttpResponse<GetAIContextByIdResponse>({
          body: { result: details },
          status: 200
        })

        aiContextService.getAIContextById.mockReturnValue(of(res.body as any))
        actions$.next(AiContextDetailsActions.navigatedToDetailsPage({ id: '123' }))

        effects.loadAiContextById$.subscribe((action) => {
          expect(action).toEqual(AiContextDetailsActions.aiContextDetailsReceived({ details }))
          done()
        })
      })

      it('should dispatch aiContextDetailsLoadingFailed on failed loadItemById$', (done) => {
        aiContextService.getAIContextById.mockReturnValue(throwError(() => 'fail'))
        actions$.next(AiContextDetailsActions.navigatedToDetailsPage({ id: '123' }))

        effects.loadAiContextById$.subscribe((action) => {
          expect(action).toEqual(AiContextDetailsActions.aiContextDetailsLoadingFailed({ error: 'fail' }))
          done()
        })
      })

      it('should call getAIContextById with empty string when id is undefined', (done) => {
        const details = { id: undefined }
        const res = new HttpResponse<GetAIContextByIdResponse>({
          body: { result: details },
          status: 200
        })

        aiContextService.getAIContextById.mockReturnValue(of(res.body as any))
        actions$.next(AiContextDetailsActions.navigatedToDetailsPage({ id: undefined }))

        effects.loadAiContextById$.subscribe((action) => {
          expect(aiContextService.getAIContextById).toHaveBeenCalledWith('')
          expect(action).toEqual(AiContextDetailsActions.aiContextDetailsReceived({ details }))
          done()
        })
      })

      it('should call getAIContextById with empty string when id is empty string', (done) => {
        const details = { id: '' }
        const res = new HttpResponse<GetAIContextByIdResponse>({
          body: { result: details },
          status: 200
        })

        aiContextService.getAIContextById.mockReturnValue(of(res.body as any))
        actions$.next(AiContextDetailsActions.navigatedToDetailsPage({ id: '' }))

        effects.loadAiContextById$.subscribe((action) => {
          expect(aiContextService.getAIContextById).toHaveBeenCalledWith('')
          expect(action).toEqual(AiContextDetailsActions.aiContextDetailsReceived({ details }))
          done()
        })
      })

      it('should dispatch aiContextMCPServersReceived on successful searchMCPServers$', (done) => {
        const mcpServers = [{ id: 'kb1', name: 'MCPServer 1' }]
        const res = new HttpResponse<SearchMCPServerResponse>({
          body: { stream: mcpServers, size: 1, number: 1, totalElements: 1, totalPages: 1 },
          status: 200
        })

        mcpServerService.searchMCPServers.mockReturnValue(of(res.body as any))
        actions$.next(AiContextDetailsActions.navigatedToDetailsPage({ id: '123' }))

        effects.loadMCPServers$.subscribe((action) => {
          expect(action).toEqual(
            AiContextDetailsActions.aiContextMCPServersReceived({
              MCPServers: mcpServers
            })
          )
          done()
        })
      })

      it('should dispatch aiContextMCPServersLoadingFailed on failed searchMCPServers$', (done) => {
        mcpServerService.searchMCPServers.mockReturnValue(throwError(() => 'fail'))
        actions$.next(AiContextDetailsActions.navigatedToDetailsPage({ id: '123' }))

        effects.loadMCPServers$.subscribe((action) => {
          expect(action).toEqual(AiContextDetailsActions.aiContextMCPServersLoadingFailed({ error: 'fail' }))
          done()
        })
      })

      it('should load aiContextMCPServers and dispatch success action', (done) => {
        const mcpServers = [{ id: '1', name: 'MCPServer 1' }]
        mcpServerService.searchMCPServers.mockReturnValue(of({ stream: mcpServers } as any))

        actions$.next(AiContextDetailsActions.navigatedToDetailsPage({ id: '123' }))

        effects.loadMCPServers$.subscribe((action) => {
          expect(mcpServerService.searchMCPServers).toHaveBeenCalled()
          expect(action).toEqual(
            AiContextDetailsActions.aiContextMCPServersReceived({
              MCPServers: mcpServers
            })
          )
          done()
        })
      })

      it('should handle error when loading aiContextMCPServers fails', (done) => {
        const error = 'Failed to load contexts'
        mcpServerService.searchMCPServers.mockReturnValue(throwError(() => error))

        actions$.next(AiContextDetailsActions.navigatedToDetailsPage({ id: '123' }))

        effects.loadMCPServers$.subscribe((action) => {
          expect(mcpServerService.searchMCPServers).toHaveBeenCalled()
          expect(action).toEqual(
            AiContextDetailsActions.aiContextMCPServersLoadingFailed({
              error
            })
          )
          done()
        })
      })
    })

    describe('loadProviders$', () => {
      it('should dispatch aiContextProvidersReceived on successful loadProviders$', (done) => {
        const providers = [{ id: 'p1', name: 'Provider 1' }]
        aiProviderService.searchAIProvider.mockReturnValue(of({ results: providers } as any))

        actions$.next(AiContextDetailsActions.navigatedToDetailsPage({ id: '123' }))

        effects.loadProviders$.subscribe((action) => {
          expect(action).toEqual(
            AiContextDetailsActions.aiContextProvidersReceived({
              providers: providers
            })
          )
          done()
        })
      })

      it('should dispatch aiContextProvidersLoadingFailed on failed loadProviders$', (done) => {
        const error = 'Failed to load providers'
        aiProviderService.searchAIProvider.mockReturnValue(throwError(() => error))

        actions$.next(AiContextDetailsActions.navigatedToDetailsPage({ id: '123' }))

        effects.loadProviders$.subscribe((action) => {
          expect(action).toEqual(AiContextDetailsActions.aiContextProvidersLoadingFailed({ error }))
          done()
        })
      })
    })

    describe('cancelButtonClick', () => {
      it('should dispatch cancelEditNotDirty if cancelButtonClicked with dirty=false', (done) => {
        actions$.next(AiContextDetailsActions.cancelButtonClicked({ dirty: false }))
        effects.cancelButtonNotDirty$.subscribe((action) => {
          expect(action).toEqual(AiContextDetailsActions.cancelEditNotDirty())
          done()
        })
      })

      it('should dispatch cancelEditBackClicked if dialogResult.button is secondary', (done) => {
        portalDialogService.openDialog.mockReturnValue(of({ button: 'secondary', result: [] }))
        actions$.next(AiContextDetailsActions.cancelButtonClicked({ dirty: true }))
        effects.cancelButtonClickedDirty$.subscribe((action) => {
          expect(action).toEqual(AiContextDetailsActions.cancelEditBackClicked())
          done()
        })
      })

      it('should dispatch cancelEditConfirmClicked if dialogResult.button is not secondary', (done) => {
        portalDialogService.openDialog.mockReturnValue(of({ button: 'primary', result: [] }))
        actions$.next(AiContextDetailsActions.cancelButtonClicked({ dirty: true }))
        effects.cancelButtonClickedDirty$.subscribe((action) => {
          expect(action).toEqual(AiContextDetailsActions.cancelEditConfirmClicked())
          done()
        })
      })

      it('should handle secondary button click in dialog - dirty', (done) => {
        portalDialogService.openDialog.mockReturnValue(of({ button: 'secondary' } as any))

        actions$.next(AiContextDetailsActions.cancelButtonClicked({ dirty: true }))

        effects.cancelButtonClickedDirty$.subscribe((action) => {
          expect(portalDialogService.openDialog).toHaveBeenCalled()
          expect(action).toEqual(AiContextDetailsActions.cancelEditBackClicked())
          done()
        })
      })

      it('should handle primary button click in dialog - dirty', (done) => {
        portalDialogService.openDialog.mockReturnValue(of({ button: 'primary' } as any))

        actions$.next(AiContextDetailsActions.cancelButtonClicked({ dirty: true }))

        effects.cancelButtonClickedDirty$.subscribe((action) => {
          expect(portalDialogService.openDialog).toHaveBeenCalled()
          expect(action).toEqual(AiContextDetailsActions.cancelEditConfirmClicked())
          done()
        })
      })
    })

    describe('displayError$', () => {
      const testCases = [
        {
          description: 'should show error message for details loading failure',
          action: AiContextDetailsActions.aiContextDetailsLoadingFailed({
            error: 'Test error'
          }),
          expectedKey: 'AI_CONTEXT_DETAILS.ERROR_MESSAGES.DETAILS_LOADING_FAILED'
        },
        {
          description: 'should show error message for MCPServers loading failure',
          action: AiContextDetailsActions.aiContextMCPServersLoadingFailed({
            error: 'Test error'
          }),
          expectedKey: 'MCPSERVER_SEARCH.ERROR_MESSAGES.SEARCH_RESULTS_LOADING_FAILED'
        }
      ]

      testCases.forEach(({ description, action, expectedKey }) => {
        it(description, (done) => {
          const errorSpy = jest.spyOn(messageService, 'error')

          actions$.next(action)

          setTimeout(() => {
            try {
              expect(errorSpy).toHaveBeenCalledWith({
                summaryKey: expectedKey
              })
              done()
            } catch (e) {
              done(e)
            }
          }, 0)
        })
      })

      it('should not show error message for unhandled actions', (done) => {
        const errorSpy = jest.spyOn(messageService, 'error')

        const unhandledAction = { type: '[Test] Unhandled Action' }
        actions$.next(unhandledAction as any)

        setTimeout(() => {
          try {
            expect(errorSpy).not.toHaveBeenCalled()
            done()
          } catch (e) {
            done(e)
          }
        }, 0)
      })
    })

    describe('navigateBack$', () => {
      let backSpy: jest.SpyInstance

      beforeEach(() => {
        backSpy = jest.spyOn(window.history, 'back').mockImplementation(() => { })
      })

      afterEach(() => {
        backSpy.mockRestore()
      })

      it('should navigate back when back navigation is possible', (done) => {
        store.overrideSelector(selectBackNavigationPossible, true)
        const action = AiContextDetailsActions.navigateBackButtonClicked()

        actions$.next(action)

        effects.navigateBack$.subscribe((result) => {
          expect(backSpy).toHaveBeenCalled()
          expect(result).toEqual(AiContextDetailsActions.backNavigationStarted())
          done()
        })
      })

      it('should dispatch backNavigationFailed when back navigation is not possible', (done) => {
        store.overrideSelector(selectBackNavigationPossible, false)
        const action = AiContextDetailsActions.navigateBackButtonClicked()

        actions$.next(action)

        effects.navigateBack$.subscribe((result) => {
          expect(backSpy).not.toHaveBeenCalled()
          expect(result).toEqual(AiContextDetailsActions.backNavigationFailed())
          done()
        })
      })
    })

    it('should create', () => {
      expect(component).toBeTruthy()
    })

    it('should display correct breadcrumbs', async () => {
      jest.spyOn(breadcrumbService, 'setItems')

      component.ngOnInit()
      fixture.detectChanges()

      expect(breadcrumbService.setItems).toHaveBeenCalledTimes(1)
      const pageHeader = await AiContextDetails.getHeader()
      const searchBreadcrumbItem = await pageHeader.getBreadcrumbItem('Details')
      expect(await searchBreadcrumbItem!.getText()).toEqual('Details')
    })

    it('should display translated headers', async () => {
      const pageHeader = await AiContextDetails.getHeader()
      expect(await pageHeader.getHeaderText()).toEqual('AiContext Details')
      expect(await pageHeader.getSubheaderText()).toEqual('Display of AiContext Details')
    })

    it('should have 2 inline actions', async () => {
      const pageHeader = await AiContextDetails.getHeader()
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

      const pageHeader = await AiContextDetails.getHeader()
      const backAction = await pageHeader.getInlineActionButtonByLabel('Back')
      store.scannedActions$.pipe(ofType(AiContextDetailsActions.navigateBackButtonClicked)).subscribe(() => {
        doneFn()
      })
      await backAction?.click()
      expect(doneFn).toHaveBeenCalledTimes(1)
    })

    it('should display item details in form fields', async () => {
      store.overrideSelector(selectAiContextDetailsViewModel, baseAiContextDetailsViewModel)
      store.refreshState()

      fixture.detectChanges()
      await fixture.whenStable()

      if (!component.formGroup) {
        component.ngOnInit()
        fixture.detectChanges()
        await fixture.whenStable()
      }

      const pageDetails = component.formGroup.value
      delete baseAiContextDetailsViewModel.details?.creationUser
      delete baseAiContextDetailsViewModel.details?.modificationCount
      delete baseAiContextDetailsViewModel.details?.modificationUser
      expect(pageDetails).toEqual({
        ...baseAiContextDetailsViewModel.details
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

      const pageHeader = await AiContextDetails.getHeader()
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
        ...baseAiContextDetailsViewModel,
        editMode: false
      }
      store.overrideSelector(selectAiContextDetailsViewModel, viewModelView)
      store.refreshState()
      fixture.detectChanges()
      await fixture.whenStable()
      expect(component.formGroup.disabled).toBeTruthy()

      const viewModelEdit = {
        ...baseAiContextDetailsViewModel,
        editMode: true
      }
      store.overrideSelector(selectAiContextDetailsViewModel, viewModelEdit)
      store.refreshState()
      fixture.detectChanges()
      await fixture.whenStable()
      expect(component.formGroup.enabled).toBeTruthy()
    })

    it('should show the correct actions for edit and view modes', async () => {
      const viewModelView = {
        ...baseAiContextDetailsViewModel,
        editMode: false
      }
      store.overrideSelector(selectAiContextDetailsViewModel, viewModelView)
      store.refreshState()
      fixture.detectChanges()
      await fixture.whenStable()
      let actions: any[] = []
      component.headerActions$.subscribe((a) => (actions = a))
      const visibleActionsView = actions.filter((a) => a.showCondition)
      const actionLabelsView = visibleActionsView.map((a) => a.labelKey)
      expect(actionLabelsView).toContain('AI_CONTEXT_DETAILS.GENERAL.BACK')
      expect(actionLabelsView).toContain('AI_CONTEXT_DETAILS.GENERAL.EDIT')
      expect(actionLabelsView).not.toContain('AI_CONTEXT_DETAILS.GENERAL.SAVE')
      expect(actionLabelsView).not.toContain('AI_CONTEXT_DETAILS.GENERAL.CANCEL')

      const viewModelEdit = {
        ...baseAiContextDetailsViewModel,
        editMode: true
      }
      store.overrideSelector(selectAiContextDetailsViewModel, viewModelEdit)
      store.refreshState()
      fixture.detectChanges()
      await fixture.whenStable()
      actions = []
      component.headerActions$.subscribe((a) => (actions = a))
      const visibleActionsEdit = actions.filter((a) => a.showCondition)
      const actionLabelsEdit = visibleActionsEdit.map((a) => a.labelKey)
      expect(actionLabelsEdit).toContain('AI_CONTEXT_DETAILS.GENERAL.SAVE')
      expect(actionLabelsEdit).toContain('AI_CONTEXT_DETAILS.GENERAL.CANCEL')
      expect(actionLabelsEdit).not.toContain('AI_CONTEXT_DETAILS.GENERAL.BACK')
      expect(actionLabelsEdit).not.toContain('AI_CONTEXT_DETAILS.GENERAL.EDIT')
    })

    it('should dispatch edit action when edit() is called', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch')
      component.edit()
      expect(dispatchSpy).toHaveBeenCalledWith(AiContextDetailsActions.editButtonClicked())
    })

    it('should dispatch navigate back action when goBack() is called', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch')
      component.goBack()
      expect(dispatchSpy).toHaveBeenCalledWith(AiContextDetailsActions.navigateBackButtonClicked())
    })

    it('should dispatch cancel action with dirty state when cancel() is called', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch')
      component.formGroup.markAsDirty()
      component.cancel()
      expect(dispatchSpy).toHaveBeenCalledWith(AiContextDetailsActions.cancelButtonClicked({ dirty: true }))
    })

    it('should dispatch save action with form values when save() is called', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch')
      component.formGroup.setValue({
        id: 'id',
        appId: 'appId',
        name: 'name',
        description: 'desc',
        mcpServers: [{ id: '', name: '' }],
        provider: { id: '', name: '' },
      })
      component.save()
      expect(dispatchSpy).toHaveBeenCalledWith(
        AiContextDetailsActions.saveButtonClicked({
          details: {
            id: 'id',
            appId: 'appId',
            name: 'name',
            description: 'desc',
            mcpServers: [{ id: '', name: '' }],
            provider: { id: '', name: '' },
          }
        })
      )
    })

    it('should dispatch delete action when delete() is called', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch')
      component.delete()
      expect(dispatchSpy).toHaveBeenCalledWith(AiContextDetailsActions.deleteButtonClicked())
    })

    it('should call breadcrumbService.setItems on ngOnInit', () => {
      const breadcrumbSpy = jest.spyOn(breadcrumbService, 'setItems')
      component.ngOnInit()
      expect(breadcrumbSpy).toHaveBeenCalledWith([
        {
          titleKey: 'AI_CONTEXT_DETAILS.BREADCRUMB',
          labelKey: 'AI_CONTEXT_DETAILS.BREADCRUMB',
          routerLink: '/ai-context'
        }
      ])
    })

    it('should execute actionCallback for each header action', () => {
      const editSpy = jest.spyOn(component, 'edit')
      const goBackSpy = jest.spyOn(component, 'goBack')
      const cancelSpy = jest.spyOn(component, 'cancel')
      const saveSpy = jest.spyOn(component, 'save')
      const deleteSpy = jest.spyOn(component, 'delete')

      const viewModelView = {
        ...baseAiContextDetailsViewModel,
        editMode: false
      }
      store.overrideSelector(selectAiContextDetailsViewModel, viewModelView)
      store.refreshState()
      fixture.detectChanges()
      let actions: any[] = []
      component.headerActions$.subscribe((a) => (actions = a))
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

      const viewModelEdit = {
        ...baseAiContextDetailsViewModel,
        editMode: true
      }
      store.overrideSelector(selectAiContextDetailsViewModel, viewModelEdit)
      store.refreshState()
      fixture.detectChanges()
      actions = []
      component.headerActions$.subscribe((a) => (actions = a))
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
      expect(dispatchSpy).toHaveBeenCalledWith(AiContextDetailsActions.cancelButtonClicked({ dirty: false }))
    })

    it('should patch the form with details and matched provider', () => {
      const provider = { id: 'ctx1', name: 'Context 1' } as any
      const details = { ...baseAiContextDetailsViewModel.details, provider: provider } as any
      const viewModel = {
        ...baseAiContextDetailsViewModel,
        details,
        editMode: false,
        provider: [provider]
      } as any
      store.overrideSelector(selectAiContextDetailsViewModel, viewModel)
      store.refreshState()
      fixture.detectChanges()
      expect(component.formGroup.value.id).toBe(details.id)
      expect(component.formGroup.value.provider).toEqual(provider)
    })

    it('should patch the form with details and matched MCP Server', () => {
      const mcpServer = { id: 'kb1', name: 'MCP Server 1' } as MCPServer
      const details = { ...baseAiContextDetailsViewModel.details, mcpServers: [mcpServer] } as AIContext
      const viewModel = {
        ...baseAiContextDetailsViewModel,
        details,
        editMode: false,
        MCPServers: [mcpServer]
      } as AiContextDetailsViewModel
      store.overrideSelector(selectAiContextDetailsViewModel, viewModel)
      store.refreshState()
      fixture.detectChanges()
      expect(component.formGroup.value.id).toBe(details.id)
      expect(component.formGroup.value.mcpServers).toEqual([mcpServer])
    })

    it('should handle missing details gracefully', () => {
      const viewModel = { ...baseAiContextDetailsViewModel, details: undefined } as any
      store.overrideSelector(selectAiContextDetailsViewModel, viewModel)
      store.refreshState()
      fixture.detectChanges()
      expect(component.formGroup.value.id).toBe('')
    })

    describe('aiContextDetailsReducer (integration)', () => {
      it('should return the initial state for an unknown action', () => {
        const action = { type: 'Unknown' } as any
        const state = aiContextDetailsReducer(undefined, action)
        expect(state).toBe(initialState)
      })

      it('should handle aiContextDetailsReceived', () => {
        const details = {
          id: '1',
          name: 'Test',
          description: '',
          aiContext: { id: 'ctx', name: 'Context' },
          vdb: '',
          vdbCollection: '',
          modificationCount: 0
        }
        const action = AiContextDetailsActions.aiContextDetailsReceived({ details })
        const state = aiContextDetailsReducer(initialState, action)
        expect(state.details).toEqual(details)
        expect(state.detailsLoadingIndicator).toBe(false)
        expect(state.detailsLoaded).toBe(true)
      })

      it('should handle aiContextDetailsLoadingFailed', () => {
        const preState: AiContextDetailsState = {
          ...initialState,
          details: {
            id: '2',
            name: 'Old',
            description: '',
            mcpServers: [
              {
                id: 'ctx',
                name: 'Context',
                apiKey: '',
                protocol: '',
                description: '',
                modificationCount: 0,
                url: ''
              }
            ]
          },
          detailsLoadingIndicator: true,
          detailsLoaded: true
        }
        const action = AiContextDetailsActions.aiContextDetailsLoadingFailed({ error: null })
        const state = aiContextDetailsReducer(preState, action)
        expect(state.details).toEqual(initialState.details)
        expect(state.detailsLoadingIndicator).toBe(false)
        expect(state.detailsLoaded).toBe(false)
      })

      it('should handle aiContextProvidersReceived', () => {
        const providers = [{ id: 'prv1', name: 'Provider 1' }]
        const action = AiContextDetailsActions.aiContextProvidersReceived({ providers: providers })
        const state = aiContextDetailsReducer(initialState, action)
        expect(state.aiProviders).toEqual(providers)
        expect(state.aiProvidersLoadingIndicator).toBe(false)
        expect(state.aiProvidersLoaded).toBe(true)
      })

      it('should handle aiContextProvidersLoadingFailed', () => {
        const preState: AiContextDetailsState = {
          ...initialState,
          aiProviders: [{ id: 'prv2', name: 'Old Provider' }],
          aiProvidersLoadingIndicator: true,
          aiProvidersLoaded: true
        }
        const action = AiContextDetailsActions.aiContextProvidersLoadingFailed({ error: null })
        const state = aiContextDetailsReducer(preState, action)
        expect(state.aiProviders).toEqual(initialState.aiProviders)
        expect(state.aiProvidersLoadingIndicator).toBe(false)
        expect(state.aiProvidersLoaded).toBe(false)
      })

      it('should handle aiContextMCPServersReceived', () => {
        const aimcpServers = [{ id: 'ctx1', name: 'Context 1' }]
        const action = AiContextDetailsActions.aiContextMCPServersReceived({ MCPServers: aimcpServers })
        const state = aiContextDetailsReducer(initialState, action)
        expect(state.mcpServers).toEqual(aimcpServers)
        expect(state.mcpServersLoadingIndicator).toBe(false)
        expect(state.mcpServersLoaded).toBe(true)
      })

      it('should handle aiContextMCPServersLoadingFailed', () => {
        const preState: AiContextDetailsState = {
          ...initialState,
          mcpServers: [{ id: 'ctx2', name: 'Old Context' }],
          mcpServersLoadingIndicator: true,
          mcpServersLoaded: true
        }
        const action = AiContextDetailsActions.aiContextMCPServersLoadingFailed({ error: null })
        const state = aiContextDetailsReducer(preState, action)
        expect(state.mcpServers).toEqual(initialState.mcpServers)
        expect(state.mcpServersLoadingIndicator).toBe(false)
        expect(state.mcpServersLoaded).toBe(false)
      })

      it('should handle navigatedToDetailsPage', () => {
        const preState: AiContextDetailsState = {
          ...initialState,
          details: {
            id: '2',
            name: 'Old',
            description: '',
            mcpServers: [
              {
                id: 'ctx',
                name: 'Context',
                apiKey: '',
                protocol: '',
                description: '',
                modificationCount: 0,
                url: ''
              }
            ]
          },
          editMode: true
        }
        const action = AiContextDetailsActions.navigatedToDetailsPage({ id: undefined })
        const state = aiContextDetailsReducer(preState, action)
        expect(state).toEqual(initialState)
      })

      it('should handle editButtonClicked', () => {
        const action = AiContextDetailsActions.editButtonClicked()
        const state = aiContextDetailsReducer(initialState, action)
        expect(state.editMode).toBe(true)
      })

      it('should handle saveButtonClicked', () => {
        const details = {
          id: '3',
          name: 'Save',
          description: '',
          provider: { id: 'id-1', name: 'provider' },
          vdb: '',
          vdbCollection: '',
          modificationCount: 0
        }
        const action = AiContextDetailsActions.saveButtonClicked({ details })
        const state = aiContextDetailsReducer(initialState, action)
        expect(state.details).toEqual(details)
        expect(state.editMode).toBe(false)
        expect(state.isSubmitting).toBe(true)
      })

      it('should handle navigateBackButtonClicked', () => {
        const action = AiContextDetailsActions.navigateBackButtonClicked()
        const state = aiContextDetailsReducer(initialState, action)
        expect(state).toEqual(initialState)
      })

      it('should handle cancelEditConfirmClicked and related actions', () => {
        const actions = [
          AiContextDetailsActions.cancelEditConfirmClicked(),
          AiContextDetailsActions.cancelEditNotDirty(),
          AiContextDetailsActions.updateAiContextCancelled(),
          AiContextDetailsActions.updateAiContextSucceeded()
        ]
        actions.forEach((action) => {
          const preState: AiContextDetailsState = { ...initialState, editMode: true, isSubmitting: true }
          const state = aiContextDetailsReducer(preState, action)
          expect(state.editMode).toBe(false)
          expect(state.isSubmitting).toBe(false)
        })
      })

      it('should handle updateAiContextFailed', () => {
        const preState: AiContextDetailsState = { ...initialState, isSubmitting: true }
        const action = AiContextDetailsActions.updateAiContextFailed({ error: null })
        const state = aiContextDetailsReducer(preState, action)
        expect(state.isSubmitting).toBe(false)
      })
    })

    describe('AiContextDetails autocomplete search methods', () => {
      it('should update mcpServerQuery$ when searchMCPServers is called', (done) => {
        const searchQuery = 'test query'
        const searchEvent = { query: searchQuery }

        component.mcpServerQuery$.subscribe((query) => {
          expect(query).toBe(searchQuery)
          done()
        })

        component.searchMCPServers(searchEvent)
      })

      it('should update providerQuery$ when searchProviders is called', (done) => {
        const searchQuery = 'provider search'
        const searchEvent = { query: searchQuery }

        component.providerQuery$.subscribe((query) => {
          expect(query).toBe(searchQuery)
          done()
        })

        component.searchProviders(searchEvent)
      })

    })

    describe('AiContextDetails Selectors', () => {
      const baseState: any = {
        details: {},
        detailsLoaded: true,
        detailsLoadingIndicator: false,

        aiProviders: [],
        aiProvidersLoaded: true,
        aiProvidersLoadingIndicator: false,

        MCPServers: [],
        MCPServersLoaded: true,
        MCPServersLoadingIndicator: false,

        backNavigationPossible: true,
        editMode: false,
        isSubmitting: false
      }

      it('should select the full view model', () => {
        const result = selectAiContextDetailsViewModel.projector(
          baseState.details,
          baseState.detailsLoadingIndicator,
          baseState.detailsLoaded,

          baseState.aiProviders,
          baseState.aiProvidersLoadingIndicator,
          baseState.aiProvidersLoaded,

          baseState.MCPServers,
          baseState.MCPServersLoadingIndicator,
          baseState.MCPServersLoaded,

          true,
          baseState.editMode,
          baseState.isSubmitting
        )

        expect(result).toEqual({
          details: baseState.details,
          detailsLoadingIndicator: false,
          detailsLoaded: true,

          aiProviders: baseState.aiProviders,
          aiProvidersLoadingIndicator: false,
          aiProvidersLoaded: true,

          MCPServers: baseState.MCPServers,
          MCPServersLoadingIndicator: false,
          MCPServersLoaded: true,

          backNavigationPossible: true,
          editMode: false,
          isSubmitting: false
        })
      })

      it('should handle undefined details and empty contexts', () => {
        const result = selectAiContextDetailsViewModel.projector(
          undefined,
          true,
          false,

          [],
          false,
          true,

          [],
          false,
          true,

          true,
          false,
          false
        )
        expect(result.details).toBeUndefined()
        expect(result.MCPServers).toEqual([])
        expect(result.detailsLoaded).toBe(false)
        expect(result.detailsLoadingIndicator).toBe(true)
      })
    })
  })
})
