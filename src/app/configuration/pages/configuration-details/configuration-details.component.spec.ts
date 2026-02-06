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
  Action,
  AlwaysGrantPermissionChecker,
  BreadcrumbService,
  HAS_PERMISSION_CHECKER,
  PortalCoreModule,
  PortalDialogService,
  PortalMessageService
} from '@onecx/portal-integration-angular'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { PrimeIcons } from 'primeng/api'
import { AutoCompleteModule } from 'primeng/autocomplete'
import { InputTextModule } from 'primeng/inputtext'
import { MultiSelectModule } from 'primeng/multiselect'
import { ReplaySubject, of, throwError } from 'rxjs'
import {
  Configuration,
  ConfigurationService,
  MCPServer,
  MCPServerPageResult,
  McpServerService,
  Provider,
  ProviderService,
} from 'src/app/shared/generated'
import { selectBackNavigationPossible } from 'src/app/shared/selectors/onecx.selectors'
import { selectRouteParam } from 'src/app/shared/selectors/router.selectors'
import { ConfigurationDetailsActions } from './configuration-details.actions'
import { ConfigurationDetailsComponent } from './configuration-details.component'
import { ConfigurationDetailsEffects } from './configuration-details.effects'
import { ConfigurationDetailsHarness } from './configuration-details.harness'
import { configurationDetailsReducer, initialState } from './configuration-details.reducers'
import { configurationDetailsSelectors, selectConfigurationDetailsViewModel } from './configuration-details.selectors'
import { ConfigurationDetailsState } from './configuration-details.state'
import { ConfigurationDetailsViewModel } from './configuration-details.viewmodel'

describe('ConfigurationDetailsComponent', () => {
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

  let component: ConfigurationDetailsComponent
  let fixture: ComponentFixture<ConfigurationDetailsComponent>
  let store: MockStore<Store>
  let breadcrumbService: BreadcrumbService
  let ConfigurationDetails: ConfigurationDetailsHarness
  let effects: ConfigurationDetailsEffects
  let actions$: ReplaySubject<any>
  let configurationService: jest.Mocked<ConfigurationService>
  let providerService: jest.Mocked<ProviderService>
  let mcpServerService: jest.Mocked<McpServerService>
  let portalDialogService: jest.Mocked<PortalDialogService>
  let messageService: jest.Mocked<PortalMessageService>
  let router: jest.Mocked<Router>

  const baseConfigurationDetailsViewModel: ConfigurationDetailsViewModel = {
    details: {
      id: 'id-1',
      name: 'details name',
      description: 'details description',
      modificationCount: 1,
      modificationUser: 'user-1',
      creationUser: 'user-1',
      llmProvider: undefined,
      mcpServers: [{
        modificationCount: 1,
        id: 'id-1',
        name: 'name-1',
        description: 'description-1'
      }]
    },
    detailsLoaded: true,
    detailsLoadingIndicator: false,
    Providers: [
      {
        modificationCount: 1,
        id: 'id-1',
        name: 'Provider name',
        description: 'Provider description',
        llmUrl: 'Provider llmUrl',
        modelName: 'Provider modelName',
        apiKey: 'Provider apiKey'
      }
    ],
    ProvidersLoaded: true,
    ProvidersLoadingIndicator: false,
    MCPServers: [
      {
        modificationCount: 1,
        id: 'id-1',
        name: 'MCPServer name',
        description: 'MCPServer description'
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
    configurationService = {
      getConfiguration: jest.fn(),
      updateConfiguration: jest.fn(),
      deleteConfiguration: jest.fn(),
      findConfigurationBySearchCriteria: jest.fn()
    } as unknown as jest.Mocked<ConfigurationService>

    providerService = {
      findProviderBySearchCriteria: jest.fn()
    } as unknown as jest.Mocked<ProviderService>

    mcpServerService = {
      findMCPServerByCriteria: jest.fn()
    } as unknown as jest.Mocked<McpServerService>

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
          component: ConfigurationDetailsComponent,
          firstChild: {
            component: ConfigurationDetailsComponent,
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
            component: ConfigurationDetailsComponent,
            firstChild: {
              component: ConfigurationDetailsComponent,
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
      declarations: [ConfigurationDetailsComponent],
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
        ConfigurationDetailsEffects,
        provideMockStore({
          initialState: { Configuration: { details: initialState, backNavigationPossible: true } }
        }),
        provideMockActions(() => actions$),
        provideUserServiceMock(),
        {
          provide: HAS_PERMISSION_CHECKER,
          useClass: AlwaysGrantPermissionChecker
        },
        BreadcrumbService,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ConfigurationService, useValue: configurationService },
        { provide: ProviderService, useValue: providerService },
        { provide: McpServerService, useValue: mcpServerService },
        { provide: Router, useValue: router },
        { provide: PortalMessageService, useValue: messageService },
        { provide: PortalDialogService, useValue: portalDialogService }
      ]
    }).compileComponents()

    effects = TestBed.inject(ConfigurationDetailsEffects)
    effects.displayError$.subscribe()

    const translateService = TestBed.inject(TranslateService)
    translateService.use('en')

    store = TestBed.inject(MockStore)
    store.overrideSelector(selectConfigurationDetailsViewModel, baseConfigurationDetailsViewModel)
    store.refreshState()

    fixture = TestBed.createComponent(ConfigurationDetailsComponent)
    component = fixture.componentInstance
    breadcrumbService = TestBed.inject(BreadcrumbService)
    fixture.detectChanges()
    ConfigurationDetails = await TestbedHarnessEnvironment.harnessForFixture(fixture, ConfigurationDetailsHarness)
  })

  describe('ConfigurationDetailsEffects', () => {
    describe('saveButtonClicked$', () => {
      it('should handle saveButtonClicked$ and dispatch saveConfigurationSucceeded on success', (done) => {
        const details = { id: '123', name: 'Test DB' }
        const res = new HttpResponse<Configuration>({
          body: { name: 'updated name' },
          status: 200
        })

        configurationService.updateConfiguration.mockReturnValue(of(res))

        store.overrideSelector(configurationDetailsSelectors.selectDetails, {
          id: '123',
          name: 'Original Name'
        })
        store.refreshState()

        actions$.next(ConfigurationDetailsActions.saveButtonClicked({ details }))

        effects.saveButtonClicked$.subscribe((action) => {
          expect(action).toEqual(ConfigurationDetailsActions.updateConfigurationSucceeded())
          done()
        })
      })

      it('should handle saveButtonClicked$ and dispatch saveConfigurationFailed on error', (done) => {
        const details = { id: '123', name: 'Test DB' }
        const error = 'Save failed'

        configurationService.updateConfiguration.mockReturnValue(throwError(() => error))
        actions$.next(ConfigurationDetailsActions.saveButtonClicked({ details }))

        effects.saveButtonClicked$.subscribe((action) => {
          expect(action).toEqual(ConfigurationDetailsActions.updateConfigurationFailed({ error }))
          done()
        })
      })

      it('should handle saveButtonClicked$ with undefined itemToEditId and dispatch updateConfigurationCancelled', (done) => {
        const details = { name: 'Test DB' } as any
        store.overrideSelector(configurationDetailsSelectors.selectDetails, details)
        store.refreshState()

        actions$.next(ConfigurationDetailsActions.saveButtonClicked({ details: { name: 'Updated Name' } } as any))

        effects.saveButtonClicked$.subscribe((action) => {
          expect(action).toEqual(ConfigurationDetailsActions.updateConfigurationCancelled())
          done()
        })
      })

      it('should handle saveButtonClicked$ and dispatch updateConfigurationCancelled on success if details is undefined', (done) => {
        const details = { id: '123', name: 'Test DB' }
        const error = 'Update failed'

        store.overrideSelector(configurationDetailsSelectors.selectDetails, undefined)
        store.refreshState()

        configurationService.deleteConfiguration.mockReturnValue(throwError(() => error))

        actions$.next(ConfigurationDetailsActions.saveButtonClicked({ details }))

        effects.saveButtonClicked$.subscribe((action) => {
          expect(action).toEqual(ConfigurationDetailsActions.updateConfigurationCancelled())
          done()
        })
      })
    })

    describe('deleteButtonClicked$', () => {
      it('should handle deleteButtonClicked$ and dispatch deleteConfigurationSucceeded on success', (done) => {
        const res = new HttpResponse({ status: 204 })
        const details = { id: '123', name: 'Test Item', description: 'Test Description' }

        store.overrideSelector(configurationDetailsSelectors.selectDetails, details)
        store.refreshState()

        portalDialogService.openDialog.mockReturnValue(
          of({
            button: 'primary',
            data: details,
            result: []
          })
        )

        configurationService.deleteConfiguration.mockReturnValue(of(res))
        actions$.next(ConfigurationDetailsActions.deleteButtonClicked())

        effects.deleteButtonClicked$.subscribe((action) => {
          expect(action).toEqual(ConfigurationDetailsActions.deleteConfigurationSucceeded())
          done()
        })
      })

      it('should handle deleteButtonClicked$ and dispatch deleteConfigurationFailed on error', (done) => {
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
        configurationService.deleteConfiguration.mockReturnValue(throwError(() => error))

        store.overrideSelector(configurationDetailsSelectors.selectDetails, mockItemToDelete)
        store.refreshState()

        actions$.next(ConfigurationDetailsActions.deleteButtonClicked())

        effects.deleteButtonClicked$.subscribe((action) => {
          expect(action).toEqual(ConfigurationDetailsActions.deleteConfigurationFailed({ error }))
          done()
        })
      })

      it('should handle deleteButtonClicked$ and dispatch deleteConfigurationCancelled on cancel', (done) => {
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
        store.overrideSelector(configurationDetailsSelectors.selectDetails, mockItemToDelete)
        store.refreshState()

        actions$.next(ConfigurationDetailsActions.deleteButtonClicked())

        effects.deleteButtonClicked$.subscribe((action) => {
          expect(action).toEqual(ConfigurationDetailsActions.deleteConfigurationCancelled())
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
        store.overrideSelector(configurationDetailsSelectors.selectDetails, mockItemToDelete)
        store.refreshState()

        actions$.next(ConfigurationDetailsActions.deleteButtonClicked())

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

        actions$.next(ConfigurationDetailsActions.deleteConfigurationSucceeded())

        effects.deleteConfigurationSucceeded$.subscribe(() => {
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
          expect(action.type).toEqual(ConfigurationDetailsActions.navigatedToDetailsPage({ id: mockId }).type)
          done()
        })
      })
    })

    describe('searchMCPServers$', () => {
      it('should dispatch configurationDetailsReceived on successful loadItemById$', (done) => {
        const details = { id: '123', name: '' }
        const res = new HttpResponse<Configuration>({
          body: { ...details },
          status: 200
        })

        configurationService.getConfiguration.mockReturnValue(of(res.body as any))
        actions$.next(ConfigurationDetailsActions.navigatedToDetailsPage({ id: '123' }))

        effects.loadConfigurationById$.subscribe((action) => {
          expect(action).toEqual(ConfigurationDetailsActions.configurationDetailsReceived({ details }))
          done()
        })
      })

      it('should dispatch configurationDetailsLoadingFailed on failed loadItemById$', (done) => {
        configurationService.getConfiguration.mockReturnValue(throwError(() => 'fail'))
        actions$.next(ConfigurationDetailsActions.navigatedToDetailsPage({ id: '123' }))

        effects.loadConfigurationById$.subscribe((action) => {
          expect(action).toEqual(ConfigurationDetailsActions.configurationDetailsLoadingFailed({ error: 'fail' }))
          done()
        })
      })

      it('should call getConfiguration with empty string when id is undefined', (done) => {
        const details = { id: undefined, name: '' }
        const res = new HttpResponse<Configuration>({
          body: { ...details },
          status: 200
        })

        configurationService.getConfiguration.mockReturnValue(of(res.body as any))
        actions$.next(ConfigurationDetailsActions.navigatedToDetailsPage({ id: undefined }))

        effects.loadConfigurationById$.subscribe((action) => {
          expect(configurationService.getConfiguration).toHaveBeenCalledWith('')
          expect(action).toEqual(ConfigurationDetailsActions.configurationDetailsReceived({ details }))
          done()
        })
      })

      it('should call getConfiguration with empty string when id is empty string', (done) => {
        const details = { id: '', name: '' }
        const res = new HttpResponse<Configuration>({
          body: { ...details },
          status: 200
        })

        configurationService.getConfiguration.mockReturnValue(of(res.body as any))
        actions$.next(ConfigurationDetailsActions.navigatedToDetailsPage({ id: '' }))

        effects.loadConfigurationById$.subscribe((action) => {
          expect(configurationService.getConfiguration).toHaveBeenCalledWith('')
          expect(action).toEqual(ConfigurationDetailsActions.configurationDetailsReceived({ details }))
          done()
        })
      })

      it('should dispatch configurationMCPServersReceived on successful searchMCPServers$', (done) => {
        const mcpServers = [{ id: 'kb1', name: 'MCPServer 1' }]
        const res = new HttpResponse<MCPServerPageResult>({
          body: { stream: mcpServers, size: 1, number: 1, totalElements: 1, totalPages: 1 },
          status: 200
        })

        mcpServerService.findMCPServerByCriteria.mockReturnValue(of(res.body as any))
        actions$.next(ConfigurationDetailsActions.navigatedToDetailsPage({ id: '123' }))

        effects.loadMCPServers$.subscribe((action) => {
          expect(action).toEqual(
            ConfigurationDetailsActions.configurationMCPServersReceived({
              MCPServers: mcpServers
            })
          )
          done()
        })
      })

      it('should dispatch configurationMCPServersLoadingFailed on failed searchMCPServers$', (done) => {
        mcpServerService.findMCPServerByCriteria.mockReturnValue(throwError(() => 'fail'))
        actions$.next(ConfigurationDetailsActions.navigatedToDetailsPage({ id: '123' }))

        effects.loadMCPServers$.subscribe((action) => {
          expect(action).toEqual(ConfigurationDetailsActions.configurationMCPServersLoadingFailed({ error: 'fail' }))
          done()
        })
      })

      it('should load configurationMCPServers and dispatch success action', (done) => {
        const mcpServers = [{ id: '1', name: 'MCPServer 1' }]
        mcpServerService.findMCPServerByCriteria.mockReturnValue(of({ stream: mcpServers } as any))

        actions$.next(ConfigurationDetailsActions.navigatedToDetailsPage({ id: '123' }))

        effects.loadMCPServers$.subscribe((action) => {
          expect(mcpServerService.findMCPServerByCriteria).toHaveBeenCalled()
          expect(action).toEqual(
            ConfigurationDetailsActions.configurationMCPServersReceived({
              MCPServers: mcpServers
            })
          )
          done()
        })
      })

      it('should handle error when loading configurationMCPServers fails', (done) => {
        const error = 'Failed to load contexts'
        mcpServerService.findMCPServerByCriteria.mockReturnValue(throwError(() => error))

        actions$.next(ConfigurationDetailsActions.navigatedToDetailsPage({ id: '123' }))

        effects.loadMCPServers$.subscribe((action) => {
          expect(mcpServerService.findMCPServerByCriteria).toHaveBeenCalled()
          expect(action).toEqual(
            ConfigurationDetailsActions.configurationMCPServersLoadingFailed({
              error
            })
          )
          done()
        })
      })
    })

    describe('loadProviders$', () => {
      it('should dispatch configurationProvidersReceived on successful loadProviders$', (done) => {
        const providers = [{ id: 'p1', name: 'Provider 1', modelName: 'model' }]
        providerService.findProviderBySearchCriteria.mockReturnValue(of({ stream: providers } as any))

        actions$.next(ConfigurationDetailsActions.navigatedToDetailsPage({ id: '123' }))

        effects.loadProviders$.subscribe((action) => {
          expect(action).toEqual(
            ConfigurationDetailsActions.configurationProvidersReceived({
              providers: providers
            })
          )
          done()
        })
      })

      it('should dispatch configurationProvidersLoadingFailed on failed loadProviders$', (done) => {
        const error = 'Failed to load providers'
        providerService.findProviderBySearchCriteria.mockReturnValue(throwError(() => error))

        actions$.next(ConfigurationDetailsActions.navigatedToDetailsPage({ id: '123' }))

        effects.loadProviders$.subscribe((action) => {
          expect(action).toEqual(ConfigurationDetailsActions.configurationProvidersLoadingFailed({ error }))
          done()
        })
      })
    })

    describe('cancelButtonClick', () => {
      it('should dispatch cancelEditNotDirty if cancelButtonClicked with dirty=false', (done) => {
        actions$.next(ConfigurationDetailsActions.cancelButtonClicked({ dirty: false }))
        effects.cancelButtonNotDirty$.subscribe((action) => {
          expect(action).toEqual(ConfigurationDetailsActions.cancelEditNotDirty())
          done()
        })
      })

      it('should dispatch cancelEditBackClicked if dialogResult.button is secondary', (done) => {
        portalDialogService.openDialog.mockReturnValue(of({ button: 'secondary', result: [] }))
        actions$.next(ConfigurationDetailsActions.cancelButtonClicked({ dirty: true }))
        effects.cancelButtonClickedDirty$.subscribe((action) => {
          expect(action).toEqual(ConfigurationDetailsActions.cancelEditBackClicked())
          done()
        })
      })

      it('should dispatch cancelEditConfirmClicked if dialogResult.button is not secondary', (done) => {
        portalDialogService.openDialog.mockReturnValue(of({ button: 'primary', result: [] }))
        actions$.next(ConfigurationDetailsActions.cancelButtonClicked({ dirty: true }))
        effects.cancelButtonClickedDirty$.subscribe((action) => {
          expect(action).toEqual(ConfigurationDetailsActions.cancelEditConfirmClicked())
          done()
        })
      })

      it('should handle secondary button click in dialog - dirty', (done) => {
        portalDialogService.openDialog.mockReturnValue(of({ button: 'secondary' } as any))

        actions$.next(ConfigurationDetailsActions.cancelButtonClicked({ dirty: true }))

        effects.cancelButtonClickedDirty$.subscribe((action) => {
          expect(portalDialogService.openDialog).toHaveBeenCalled()
          expect(action).toEqual(ConfigurationDetailsActions.cancelEditBackClicked())
          done()
        })
      })

      it('should handle primary button click in dialog - dirty', (done) => {
        portalDialogService.openDialog.mockReturnValue(of({ button: 'primary' } as any))

        actions$.next(ConfigurationDetailsActions.cancelButtonClicked({ dirty: true }))

        effects.cancelButtonClickedDirty$.subscribe((action) => {
          expect(portalDialogService.openDialog).toHaveBeenCalled()
          expect(action).toEqual(ConfigurationDetailsActions.cancelEditConfirmClicked())
          done()
        })
      })
    })

    describe('displayError$', () => {
      const testCases = [
        {
          description: 'should show error message for details loading failure',
          action: ConfigurationDetailsActions.configurationDetailsLoadingFailed({
            error: 'Test error'
          }),
          expectedKey: 'CONFIGURATION_DETAILS.ERROR_MESSAGES.DETAILS_LOADING_FAILED'
        },
        {
          description: 'should show error message for MCPServers loading failure',
          action: ConfigurationDetailsActions.configurationMCPServersLoadingFailed({
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
        const action = ConfigurationDetailsActions.navigateBackButtonClicked()

        actions$.next(action)

        effects.navigateBack$.subscribe((result) => {
          expect(backSpy).toHaveBeenCalled()
          expect(result).toEqual(ConfigurationDetailsActions.backNavigationStarted())
          done()
        })
      })

      it('should dispatch backNavigationFailed when back navigation is not possible', (done) => {
        store.overrideSelector(selectBackNavigationPossible, false)
        const action = ConfigurationDetailsActions.navigateBackButtonClicked()

        actions$.next(action)

        effects.navigateBack$.subscribe((result) => {
          expect(backSpy).not.toHaveBeenCalled()
          expect(result).toEqual(ConfigurationDetailsActions.backNavigationFailed())
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
      const pageHeader = await ConfigurationDetails.getHeader()
      const searchBreadcrumbItem = await pageHeader.getBreadcrumbItem('Details')
      expect(await searchBreadcrumbItem!.getText()).toEqual('Details')
    })

    it('should display translated headers', async () => {
      const pageHeader = await ConfigurationDetails.getHeader()
      expect(await pageHeader.getHeaderText()).toEqual('Configuration Details')
      expect(await pageHeader.getSubheaderText()).toEqual('Display of Configuration Details')
    })

    it('should have 2 inline actions', async () => {
      const pageHeader = await ConfigurationDetails.getHeader()
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

      const pageHeader = await ConfigurationDetails.getHeader()
      const backAction = await pageHeader.getInlineActionButtonByLabel('Back')
      store.scannedActions$.pipe(ofType(ConfigurationDetailsActions.navigateBackButtonClicked)).subscribe(() => {
        doneFn()
      })
      await backAction?.click()
      expect(doneFn).toHaveBeenCalledTimes(1)
    })

    it('should display item details in form fields', async () => {
      store.overrideSelector(selectConfigurationDetailsViewModel, baseConfigurationDetailsViewModel)
      store.refreshState()

      fixture.detectChanges()
      await fixture.whenStable()

      if (!component.formGroup) {
        component.ngOnInit()
        fixture.detectChanges()
        await fixture.whenStable()
      }

      const pageDetails = component.formGroup.value
      delete baseConfigurationDetailsViewModel.details?.creationUser
      delete baseConfigurationDetailsViewModel.details?.modificationCount
      delete baseConfigurationDetailsViewModel.details?.modificationUser
      expect(pageDetails).toEqual({
        ...baseConfigurationDetailsViewModel.details
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

      const pageHeader = await ConfigurationDetails.getHeader()
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
        ...baseConfigurationDetailsViewModel,
        editMode: false
      }
      store.overrideSelector(selectConfigurationDetailsViewModel, viewModelView)
      store.refreshState()
      
      fixture.detectChanges()
      await fixture.whenStable()
      
      expect(component.formGroup.disabled).toBeTruthy()

      const viewModelEdit = {
        ...baseConfigurationDetailsViewModel,
        editMode: true
      }
      store.overrideSelector(selectConfigurationDetailsViewModel, viewModelEdit)
      store.refreshState()
     
      fixture.detectChanges()
      await fixture.whenStable()

      expect(component.formGroup.enabled).toBeTruthy()
    })

    it('should show the correct actions for edit and view modes', async () => {
      const viewModelView = {
        ...baseConfigurationDetailsViewModel,
        editMode: false
      }  
      store.overrideSelector(selectConfigurationDetailsViewModel, viewModelView)
      store.refreshState()

      fixture.detectChanges()
      await fixture.whenStable()

      let actions: Action[] = []
      component.headerActions$.subscribe((a) => (actions = a))
      const visibleActionsView = actions.filter((a) => a.showCondition)
      const actionLabelsView = visibleActionsView.map((a) => a.labelKey)
      expect(actionLabelsView).toContain('CONFIGURATION_DETAILS.GENERAL.BACK')
      expect(actionLabelsView).toContain('CONFIGURATION_DETAILS.GENERAL.EDIT')
      expect(actionLabelsView).not.toContain('CONFIGURATION_DETAILS.GENERAL.SAVE')
      expect(actionLabelsView).not.toContain('CONFIGURATION_DETAILS.GENERAL.CANCEL')

      const viewModelEdit = {
        ...baseConfigurationDetailsViewModel,
        editMode: true
      }
      store.overrideSelector(selectConfigurationDetailsViewModel, viewModelEdit)

      store.refreshState()
      fixture.detectChanges()
      await fixture.whenStable()

      actions = []
      component.headerActions$.subscribe((a) => (actions = a))
      const visibleActionsEdit = actions.filter((a) => a.showCondition)
      const actionLabelsEdit = visibleActionsEdit.map((a) => a.labelKey)
      expect(actionLabelsEdit).toContain('CONFIGURATION_DETAILS.GENERAL.SAVE')
      expect(actionLabelsEdit).toContain('CONFIGURATION_DETAILS.GENERAL.CANCEL')
      expect(actionLabelsEdit).not.toContain('CONFIGURATION_DETAILS.GENERAL.BACK')
      expect(actionLabelsEdit).not.toContain('CONFIGURATION_DETAILS.GENERAL.EDIT')
    })

    it('should dispatch edit action when edit() is called', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch')
      
      component.edit()

      expect(dispatchSpy).toHaveBeenCalledWith(ConfigurationDetailsActions.editButtonClicked())
    })

    it('should dispatch navigate back action when goBack() is called', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch')

      component.goBack()

      expect(dispatchSpy).toHaveBeenCalledWith(ConfigurationDetailsActions.navigateBackButtonClicked())
    })

    it('should dispatch cancel action with dirty state when cancel() is called', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch')

      component.formGroup.markAsDirty()
      component.cancel()

      expect(dispatchSpy).toHaveBeenCalledWith(ConfigurationDetailsActions.cancelButtonClicked({ dirty: true }))
    })

    it('should dispatch save action with form values when save() is called', () => {
      const mockValue = {
        id: 'id',        
        name: 'name',
        description: 'desc',
        mcpServers: [{ id: '', name: '' }],
        llmProvider: { id: 'id-1', name: 'provider', modelName: 'model' },
      }
      const dispatchSpy = jest.spyOn(store, 'dispatch')

      component.formGroup.setValue(mockValue)
      component.save()

      expect(dispatchSpy).toHaveBeenCalledWith(
        ConfigurationDetailsActions.saveButtonClicked({
          details: {
            ...mockValue
          }
        })
      )
    })

    it('should dispatch delete action when delete() is called', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch')
      component.delete()
      expect(dispatchSpy).toHaveBeenCalledWith(ConfigurationDetailsActions.deleteButtonClicked())
    })

    it('should call breadcrumbService.setItems on ngOnInit', () => {
      const breadcrumbSpy = jest.spyOn(breadcrumbService, 'setItems')
      component.ngOnInit()
      expect(breadcrumbSpy).toHaveBeenCalledWith([
        {
          titleKey: 'CONFIGURATION_DETAILS.BREADCRUMB',
          labelKey: 'CONFIGURATION_DETAILS.BREADCRUMB',
          routerLink: '/configuration'
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
        ...baseConfigurationDetailsViewModel,
        editMode: false
      }
      store.overrideSelector(selectConfigurationDetailsViewModel, viewModelView)
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
        ...baseConfigurationDetailsViewModel,
        editMode: true
      }
      store.overrideSelector(selectConfigurationDetailsViewModel, viewModelEdit)
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
      expect(dispatchSpy).toHaveBeenCalledWith(ConfigurationDetailsActions.cancelButtonClicked({ dirty: false }))
    })

    it('should patch the form with details and matched provider', () => {
      const provider = { id: 'id-1', name: 'provider', modelName: 'model' } as Provider
      const details = { ...baseConfigurationDetailsViewModel.details, llmProvider: provider } as any
      const viewModel = {
        ...baseConfigurationDetailsViewModel,
        details,
        editMode: false,
        llmProvider: [provider]
      } as any
      store.overrideSelector(selectConfigurationDetailsViewModel, viewModel)
      store.refreshState()
      fixture.detectChanges()
      expect(component.formGroup.value.id).toBe(details.id)
      expect(component.formGroup.value.llmProvider).toEqual(provider)
    })

    it('should patch the form with details and matched MCP Server', () => {
      const mcpServer = { id: 'kb1', name: 'MCP Server 1' } as MCPServer
      const details = { ...baseConfigurationDetailsViewModel.details, mcpServers: [mcpServer] } as Configuration
      const viewModel = {
        ...baseConfigurationDetailsViewModel,
        details,
        editMode: false,
        MCPServers: [mcpServer]
      } as ConfigurationDetailsViewModel
      store.overrideSelector(selectConfigurationDetailsViewModel, viewModel)
      store.refreshState()
      fixture.detectChanges()
      expect(component.formGroup.value.id).toBe(details.id)
      expect(component.formGroup.value.mcpServers).toEqual([mcpServer])
    })

    it('should handle missing details gracefully', () => {
      const viewModel = { ...baseConfigurationDetailsViewModel, details: undefined } as any
      store.overrideSelector(selectConfigurationDetailsViewModel, viewModel)
      store.refreshState()
      fixture.detectChanges()
      expect(component.formGroup.value.id).toBe('')
    })

    describe('configurationDetailsReducer (integration)', () => {
      it('should return the initial state for an unknown action', () => {
        const action = { type: 'Unknown' } as any
        const state = configurationDetailsReducer(undefined, action)
        expect(state).toBe(initialState)
      })

      it('should handle configurationDetailsReceived', () => {
        const details = {
          id: '1',
          name: 'Test',
          description: '',
          configuration: { id: 'ctx', name: 'Context' },
          vdb: '',
          vdbCollection: '',
          modificationCount: 0
        }
        const action = ConfigurationDetailsActions.configurationDetailsReceived({ details })
        const state = configurationDetailsReducer(initialState, action)
        expect(state.details).toEqual(details)
        expect(state.detailsLoadingIndicator).toBe(false)
        expect(state.detailsLoaded).toBe(true)
      })

      it('should handle configurationDetailsLoadingFailed', () => {
        const preState: ConfigurationDetailsState = {
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
                description: '',
                modificationCount: 0,
                url: ''
              }
            ]
          },
          detailsLoadingIndicator: true,
          detailsLoaded: true
        }
        const action = ConfigurationDetailsActions.configurationDetailsLoadingFailed({ error: null })
        const state = configurationDetailsReducer(preState, action)
        expect(state.details).toEqual(initialState.details)
        expect(state.detailsLoadingIndicator).toBe(false)
        expect(state.detailsLoaded).toBe(false)
      })

      it('should handle configurationProvidersReceived', () => {
        const providers = [{ id: 'prv1', name: 'Provider 1', modelName: 'model' }]
        const action = ConfigurationDetailsActions.configurationProvidersReceived({ providers: providers })
        const state = configurationDetailsReducer(initialState, action)
        expect(state.Providers).toEqual(providers)
        expect(state.ProvidersLoadingIndicator).toBe(false)
        expect(state.ProvidersLoaded).toBe(true)
      })

      it('should handle configurationProvidersLoadingFailed', () => {
        const preState: ConfigurationDetailsState = {
          ...initialState,
          Providers: [{ id: 'prv2', name: 'Old Provider', modelName: 'model' }],
          ProvidersLoadingIndicator: true,
          ProvidersLoaded: true
        }
        const action = ConfigurationDetailsActions.configurationProvidersLoadingFailed({ error: null })
        const state = configurationDetailsReducer(preState, action)
        expect(state.Providers).toEqual(initialState.Providers)
        expect(state.ProvidersLoadingIndicator).toBe(false)
        expect(state.ProvidersLoaded).toBe(false)
      })

      it('should handle configurationMCPServersReceived', () => {
        const aimcpServers = [{ id: 'ctx1', name: 'Context 1' }]
        const action = ConfigurationDetailsActions.configurationMCPServersReceived({ MCPServers: aimcpServers })
        const state = configurationDetailsReducer(initialState, action)
        expect(state.mcpServers).toEqual(aimcpServers)
        expect(state.mcpServersLoadingIndicator).toBe(false)
        expect(state.mcpServersLoaded).toBe(true)
      })

      it('should handle configurationMCPServersLoadingFailed', () => {
        const preState: ConfigurationDetailsState = {
          ...initialState,
          mcpServers: [{ id: 'ctx2', name: 'Old Context' }],
          mcpServersLoadingIndicator: true,
          mcpServersLoaded: true
        }
        const action = ConfigurationDetailsActions.configurationMCPServersLoadingFailed({ error: null })
        const state = configurationDetailsReducer(preState, action)
        expect(state.mcpServers).toEqual(initialState.mcpServers)
        expect(state.mcpServersLoadingIndicator).toBe(false)
        expect(state.mcpServersLoaded).toBe(false)
      })

      it('should handle navigatedToDetailsPage', () => {
        const preState: ConfigurationDetailsState = {
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
                description: '',
                modificationCount: 0,
                url: ''
              }
            ]
          },
          editMode: true
        }
        const action = ConfigurationDetailsActions.navigatedToDetailsPage({ id: undefined })
        const state = configurationDetailsReducer(preState, action)
        expect(state).toEqual(initialState)
      })

      it('should handle editButtonClicked', () => {
        const action = ConfigurationDetailsActions.editButtonClicked()
        const state = configurationDetailsReducer(initialState, action)
        expect(state.editMode).toBe(true)
      })

      it('should handle saveButtonClicked', () => {
        const details = {
          id: '3',
          name: 'Save',
          description: '',
          llmProvider: { id: 'id-1', name: 'provider', modelName: 'model' },
          modificationCount: 0
        }
        const action = ConfigurationDetailsActions.saveButtonClicked({ details })
        const state = configurationDetailsReducer(initialState, action)
        expect(state.details).toEqual(details)
        expect(state.editMode).toBe(false)
        expect(state.isSubmitting).toBe(true)
      })

      it('should handle navigateBackButtonClicked', () => {
        const action = ConfigurationDetailsActions.navigateBackButtonClicked()
        const state = configurationDetailsReducer(initialState, action)
        expect(state).toEqual(initialState)
      })

      it('should handle cancelEditConfirmClicked and related actions', () => {
        const actions = [
          ConfigurationDetailsActions.cancelEditConfirmClicked(),
          ConfigurationDetailsActions.cancelEditNotDirty(),
          ConfigurationDetailsActions.updateConfigurationCancelled(),
          ConfigurationDetailsActions.updateConfigurationSucceeded()
        ]
        actions.forEach((action) => {
          const preState: ConfigurationDetailsState = { ...initialState, editMode: true, isSubmitting: true }
          const state = configurationDetailsReducer(preState, action)
          expect(state.editMode).toBe(false)
          expect(state.isSubmitting).toBe(false)
        })
      })

      it('should handle updateConfigurationFailed', () => {
        const preState: ConfigurationDetailsState = { ...initialState, isSubmitting: true }
        const action = ConfigurationDetailsActions.updateConfigurationFailed({ error: null })
        const state = configurationDetailsReducer(preState, action)
        expect(state.isSubmitting).toBe(false)
      })
    })

    describe('ConfigurationDetails autocomplete search methods', () => {
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

    describe('ConfigurationDetails Selectors', () => {
      const baseState: any = {
        details: {},
        detailsLoaded: true,
        detailsLoadingIndicator: false,

        Providers: [],
        ProvidersLoaded: true,
        ProvidersLoadingIndicator: false,

        MCPServers: [],
        MCPServersLoaded: true,
        MCPServersLoadingIndicator: false,

        backNavigationPossible: true,
        editMode: false,
        isSubmitting: false
      }

      it('should select the full view model', () => {
        const result = selectConfigurationDetailsViewModel.projector(
          baseState.details,
          baseState.detailsLoadingIndicator,
          baseState.detailsLoaded,

          baseState.Providers,
          baseState.ProvidersLoadingIndicator,
          baseState.ProvidersLoaded,

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

          Providers: baseState.Providers,
          ProvidersLoadingIndicator: false,
          ProvidersLoaded: true,

          MCPServers: baseState.MCPServers,
          MCPServersLoadingIndicator: false,
          MCPServersLoaded: true,

          backNavigationPossible: true,
          editMode: false,
          isSubmitting: false
        })
      })

      it('should handle undefined details and empty contexts', () => {
        const result = selectConfigurationDetailsViewModel.projector(
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
