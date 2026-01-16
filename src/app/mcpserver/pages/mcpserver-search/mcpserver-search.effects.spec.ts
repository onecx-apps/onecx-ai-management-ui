import { TestBed } from '@angular/core/testing'
import { ActivatedRoute, Router } from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing'
import { Store } from '@ngrx/store'
import { MockStore, provideMockStore } from '@ngrx/store/testing'
import { provideMockActions } from '@ngrx/effects/testing'
import { MonoTypeOperatorFunction, ReplaySubject, map, of, throwError } from 'rxjs'
import { MCPServerBffService } from '../../../shared/generated'
import { ExportDataService, PortalMessageService } from '@onecx/portal-integration-angular'
import { MCPServerSearchEffects } from './mcpserver-search.effects'
import { MCPServerSearchActions } from './mcpserver-search.actions'
import { mcpserverSearchSelectors, selectMCPServerSearchViewModel } from './mcpserver-search.selectors'
import { MCPServerSearchCriteria } from './mcpserver-search.parameters'
import { initialState } from './mcpserver-search.reducers'
import { selectUrl } from 'src/app/shared/selectors/router.selectors'
import { MCPServerSearchViewModel } from './mcpserver-search.viewmodel'
import { routerNavigatedAction } from '@ngrx/router-store'

jest.mock('@onecx/ngrx-accelerator', () => {
  const actual = jest.requireActual('@onecx/ngrx-accelerator')
  const passThroughOp = <T>(): MonoTypeOperatorFunction<T> => map((x: T) => x)
  return {
    ...actual,
    filterForNavigatedTo: jest.fn((...args: unknown[]) => {
      void args
      return passThroughOp()
    }),
    filterOutQueryParamsHaveNotChanged: jest.fn((...args: unknown[]) => {
      void args
      return passThroughOp()
    })
  }
})

describe('MCPServerSearchEffects', () => {
  const mockActivatedRoute = {
    snapshot: {
      data: {}
    }
  }

  let actions$: ReplaySubject<unknown>
  let effects: MCPServerSearchEffects
  let store: MockStore<Store>
  let router: jest.Mocked<Router>
  let route: ActivatedRoute
  let mcpService: jest.Mocked<MCPServerBffService>
  let messageService: jest.Mocked<PortalMessageService>
  let exportDataService: jest.Mocked<ExportDataService>

  const mockCriteria: MCPServerSearchCriteria = {
    name: 'test-name',
    description: 'test-description'
  }

  beforeEach(async () => {
    actions$ = new ReplaySubject(1)

    mcpService = {
      searchMCPServers: jest.fn()
    } as unknown as jest.Mocked<MCPServerBffService>

    router = {
      navigate: jest.fn().mockReturnValue(Promise.resolve(true)),
      parseUrl: jest.fn().mockImplementation((url: string) => {
        const urlParts = url.split('?')[0]
        return {
          queryParams: {},
          fragment: null,
          toString: () => urlParts
        }
      }),
      events: of()
    } as unknown as jest.Mocked<Router>

    messageService = {
      error: jest.fn()
    } as unknown as jest.Mocked<PortalMessageService>

    exportDataService = {
      exportCsv: jest.fn()
    } as unknown as jest.Mocked<ExportDataService>

    route = {
      queryParams: of({
        name: 'test-name',
        description: 'test-description'
      }),
      snapshot: {
        queryParams: {}
      }
    } as unknown as ActivatedRoute

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        MCPServerSearchEffects,
        provideMockStore({
          initialState: { mcpserver: { search: initialState } }
        }),
        provideMockActions(() => actions$),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: route },
        { provide: MCPServerBffService, useValue: mcpService },
        { provide: PortalMessageService, useValue: messageService },
        { provide: ExportDataService, useValue: exportDataService }
      ]
    }).compileComponents()

    // Instead of letting Angular DI try to resolve the @SkipSelf() ActivatedRoute (which has no parent injector in TestBed),
    // construct the effect instance manually and pass the desired route object as the "parent".
    const { Actions } = await import('@ngrx/effects')
    const ngrxActions = new Actions(actions$ as any)
    effects = new MCPServerSearchEffects(
      ngrxActions,
      route as any,
      mcpService as any,
      router as any,
      TestBed.inject(MockStore),
      messageService as any,
      exportDataService as any
    )
    store = TestBed.inject(MockStore)
  })

  describe('syncParamsToUrl$', () => {
    beforeEach(() => {
      store.overrideSelector(mcpserverSearchSelectors.selectCriteria, mockCriteria)
      store.refreshState()
    })

    it('should navigate to update URL when criteria differs from query params', (done) => {
      const navigateSpy = jest.spyOn(router, 'navigate')

      route.queryParams = of({
        name: 'different-name',
        description: 'different-description'
      })

      actions$.next(MCPServerSearchActions.searchButtonClicked({ searchCriteria: mockCriteria }))

      effects.syncParamsToUrl$.subscribe(() => {
        expect(navigateSpy).toHaveBeenCalledWith([], {
          relativeTo: route,
          queryParams: mockCriteria,
          replaceUrl: true,
          onSameUrlNavigation: 'ignore'
        })
        done()
      })
    })

    it('should not navigate when criteria matches query params', (done) => {
      const navigateSpy = jest.spyOn(router, 'navigate')

      route.queryParams = of(mockCriteria)

      actions$.next(MCPServerSearchActions.searchButtonClicked({ searchCriteria: mockCriteria }))

      effects.syncParamsToUrl$.subscribe(() => {
        expect(navigateSpy).not.toHaveBeenCalled()
        done()
      })
    })

    it('should navigate when resetButtonClicked action is triggered', (done) => {
      const navigateSpy = jest.spyOn(router, 'navigate')

      route.queryParams = of({ name: 'different-name' })

      actions$.next(MCPServerSearchActions.resetButtonClicked())

      effects.syncParamsToUrl$.subscribe(() => {
        expect(navigateSpy).toHaveBeenCalledWith([], {
          relativeTo: route,
          queryParams: mockCriteria,
          replaceUrl: true,
          onSameUrlNavigation: 'ignore'
        })
        done()
      })
    })
  })

  describe('detailsButtonClicked$', () => {
    beforeEach(() => {
      store.overrideSelector(selectUrl, '/search?param=value#fragment')
      store.refreshState()
    })

    it('should navigate to details page with correct URL structure', (done) => {
      const testId = 'test-123'
      const navigateSpy = jest.spyOn(router, 'navigate')

      actions$.next(MCPServerSearchActions.detailsButtonClicked({ id: testId }))

      effects.detailsButtonClicked$.subscribe(() => {
        expect(navigateSpy).toHaveBeenCalledWith(['/search', 'details', testId])
        done()
      })
    })

    it('should clear query params and fragment from URL', (done) => {
      const testId = 'test-456'
      const parseUrlSpy = jest.spyOn(router, 'parseUrl')

      const mockUrlTree = {
        toString: jest.fn(() => '/search'),
        queryParams: { param: 'value' },
        fragment: 'fragment'
      }

      parseUrlSpy.mockReturnValue(mockUrlTree as never)

      actions$.next(MCPServerSearchActions.detailsButtonClicked({ id: testId }))

      effects.detailsButtonClicked$.subscribe(() => {
        expect(mockUrlTree.queryParams).toEqual({})
        expect(mockUrlTree.fragment).toBeNull()
        done()
      })
    })
  })

  describe('searchByUrl$', () => {
    beforeEach(() => {
      store.overrideSelector(mcpserverSearchSelectors.selectCriteria, mockCriteria)
      store.refreshState()

      mcpService.searchMCPServers.mockReturnValue(
        of({
          stream: [{ id: '1', name: 'Test MCP Server' }],
          size: 10,
          number: 0,
          totalElements: 1,
          totalPages: 1
        }) as never
      )
    })

    it('should call performSearch with criteria from store on router navigation', (done) => {
      const expectedAction = MCPServerSearchActions.mcpserverSearchResultsReceived({
        stream: [],
        size: 0,
        number: 0,
        totalElements: 0,
        totalPages: 0
      })

      const performSpy = jest
        .spyOn(effects, 'performSearch')
        .mockReturnValue(of(expectedAction) as any)

      actions$.next({ type: routerNavigatedAction.type })

      effects.searchByUrl$.subscribe((action) => {
        expect(performSpy).toHaveBeenCalledWith(mockCriteria)
        expect(action).toEqual(expectedAction)
        done()
      })
    })

    it('should call performSearch and dispatch mcpserverSearchResultsReceived on successful search', (done) => {
      effects.performSearch(mockCriteria).subscribe((action) => {
        expect(action.type).toEqual(MCPServerSearchActions.mcpserverSearchResultsReceived.type)
        expect(action).toEqual(
          MCPServerSearchActions.mcpserverSearchResultsReceived({
            stream: [{ id: '1', name: 'Test MCP Server' }],
            size: 10,
            number: 0,
            totalElements: 1,
            totalPages: 1
          })
        )
        done()
      })
    })

    it('should dispatch mcpserverSearchResultsLoadingFailed on search error', (done) => {
      const mockError = 'Search failed'

      mcpService.searchMCPServers.mockReturnValue(throwError(() => mockError))

      effects.performSearch(mockCriteria).subscribe((action) => {
        expect(action.type).toEqual(MCPServerSearchActions.mcpserverSearchResultsLoadingFailed.type)
        expect(action).toEqual(
          MCPServerSearchActions.mcpserverSearchResultsLoadingFailed({
            error: mockError
          })
        )
        done()
      })
    })

    it('should handle Date objects in search criteria', (done) => {
      const criteriaWithDate = {
        ...mockCriteria,
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31')
      }

      const searchSpy = jest.spyOn(mcpService, 'searchMCPServers')

      effects.performSearch(criteriaWithDate).subscribe(() => {
        expect(searchSpy).toHaveBeenCalledWith({
          ...mockCriteria,
          startDate: '2023-01-01T00:00:00.000Z',
          endDate: '2023-12-31T00:00:00.000Z'
        })
        done()
      })
    })
  })

  describe('exportData$', () => {
    it('should handle export with empty displayed columns', (done) => {
      const mockViewModel = {
      columns: [],
      searchCriteria: {},
      results: [
        { id: '1', name: 'Server 1', description: 'Description 1', imagePath: '' }
      ],
      displayedColumns: [],
      resultComponentState: { displayedColumns: undefined },
      searchHeaderComponentState: null,
      diagramComponentState: null,
      chartVisible: false,
      searchLoadingIndicator: false,
      searchExecuted: true
      } as unknown as MCPServerSearchViewModel

      store.overrideSelector(selectMCPServerSearchViewModel, mockViewModel)
      store.refreshState()

      effects.exportData$.subscribe(() => {
      expect(exportDataService.exportCsv).toHaveBeenCalled()
      done()
      })

      actions$.next(MCPServerSearchActions.exportButtonClicked())
    })

    it('should handle export with null resultComponentState', (done) => {
      const mockViewModel = {
      columns: [],
      searchCriteria: {},
      results: [
        { id: '1', name: 'Server 1', description: 'Description 1', imagePath: '' }
      ],
      displayedColumns: [],
      resultComponentState: null,
      searchHeaderComponentState: null,
      diagramComponentState: null,
      chartVisible: false,
      searchLoadingIndicator: false,
      searchExecuted: true
      } as unknown as MCPServerSearchViewModel

      store.overrideSelector(selectMCPServerSearchViewModel, mockViewModel)
      store.refreshState()

      effects.exportData$.subscribe(() => {
      expect(exportDataService.exportCsv).toHaveBeenCalled()
      done()
      })

      actions$.next(MCPServerSearchActions.exportButtonClicked())
    })

    it('should export CSV with correct parameters when export button is clicked', (done) => {
      const mockColumns = [
        { field: 'name', header: 'Name' },
        { field: 'description', header: 'Description' }
      ]
      const mockResults = [
        { id: '1', name: 'Server 1', description: 'Description 1' },
        { id: '2', name: 'Server 2', description: 'Description 2' }
      ]
      const mockViewModel = {
        resultComponentState: {
          displayedColumns: mockColumns
        },
        results: mockResults
      } as unknown as MCPServerSearchViewModel

      store.overrideSelector(selectMCPServerSearchViewModel, mockViewModel)
      store.refreshState()

      effects.exportData$.subscribe(() => {
        expect(exportDataService.exportCsv).toHaveBeenCalledWith(
          mockColumns,
          mockResults,
          'MCPServer.csv'
        )
        done()
      })

      actions$.next(MCPServerSearchActions.exportButtonClicked())
    })

    it('should handle export with empty results', (done) => {
      const mockColumns = [
        { field: 'name', header: 'Name' },
        { field: 'description', header: 'Description' }
      ]
      const mockViewModel = {
        resultComponentState: {
          displayedColumns: mockColumns
        },
        results: []
      } as unknown as MCPServerSearchViewModel

      store.overrideSelector(selectMCPServerSearchViewModel, mockViewModel)
      store.refreshState()

      effects.exportData$.subscribe(() => {
        expect(exportDataService.exportCsv).toHaveBeenCalledWith(
          mockColumns,
          [],
          'MCPServer.csv'
        )
        done()
      })

      actions$.next(MCPServerSearchActions.exportButtonClicked())
    })
  })

  describe('displayError$', () => {
    it('should display error message when mcpserverSearchResultsLoadingFailed action is dispatched', (done) => {
      effects.displayError$.subscribe(() => {
        expect(messageService.error).toHaveBeenCalledWith({
          summaryKey: 'MCPSERVER_SEARCH.ERROR_MESSAGES.SEARCH_RESULTS_LOADING_FAILED'
        })
        done()
      })

      actions$.next(MCPServerSearchActions.mcpserverSearchResultsLoadingFailed({ error: 'Test error' }))
    })

    it('should not display error message for actions not in errorMessages array', (done) => {
      setTimeout(() => {
        expect(messageService.error).not.toHaveBeenCalled()
        done()
      }, 0)

      actions$.next(MCPServerSearchActions.resetButtonClicked())
    })
  })

})
