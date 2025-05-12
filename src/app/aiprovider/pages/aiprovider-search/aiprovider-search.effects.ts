import { Injectable, SkipSelf } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { concatLatestFrom } from '@ngrx/operators'
import { routerNavigatedAction } from '@ngrx/router-store'
import { Action, Store } from '@ngrx/store'
import {
  filterForNavigatedTo,
  filterOutOnlyQueryParamsChanged,
  filterOutQueryParamsHaveNotChanged
} from '@onecx/ngrx-accelerator'
import {
  DialogState,
  ExportDataService,
  PortalDialogService,
  PortalMessageService
} from '@onecx/portal-integration-angular'
import equal from 'fast-deep-equal'
import { PrimeIcons } from 'primeng/api'
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs'
import { AIProvider, CreateAIProvider, UpdateAIProvider } from 'src/app/shared/generated'
import { selectUrl } from 'src/app/shared/selectors/router.selectors'

import { AIProviderBffService } from 'src/app/shared/generated/api/aIProviderBffService.service'
import { AIProviderSearchActions } from './aiprovider-search.actions'
import { AIProviderSearchComponent } from './aiprovider-search.component'
import { AIProviderSearchCriteriasSchema } from './aiprovider-search.parameters'
import { AIProviderSearchSelectors, selectAIProviderSearchViewModel } from './aiprovider-search.selectors'
import { AIProviderCreateUpdateComponent } from './dialogs/aiprovider-create-update/aiprovider-create-update.component'

@Injectable()
export class AIProviderSearchEffects {
  constructor(
    private portalDialogService: PortalDialogService,
    private actions$: Actions,
    @SkipSelf() private route: ActivatedRoute,
    private AIProviderService: AIProviderBffService,
    private router: Router,
    private store: Store,
    private messageService: PortalMessageService,
    private readonly exportDataService: ExportDataService
  ) {}

  syncParamsToUrl$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AIProviderSearchActions.searchButtonClicked, AIProviderSearchActions.resetButtonClicked),
        concatLatestFrom(() => [this.store.select(AIProviderSearchSelectors.selectCriteria), this.route.queryParams]),
        tap(([, criteria, queryParams]) => {
          const results = AIProviderSearchCriteriasSchema.safeParse(queryParams)
          if (!results.success || !equal(criteria, results.data)) {
            const params = {
              ...criteria
              //TODO: Move to docs to explain how to only put the date part in the URL in case you have date and not datetime
              //exampleDate: criteria.exampleDate?.toISOString()?.slice(0, 10)
            }
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: params,
              replaceUrl: true,
              onSameUrlNavigation: 'ignore'
            })
          }
        })
      )
    },
    { dispatch: false }
  )

  detailsButtonClicked$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AIProviderSearchActions.detailsButtonClicked),
        concatLatestFrom(() => this.store.select(selectUrl)),
        tap(([action, currentUrl]) => {
          const urlTree = this.router.parseUrl(currentUrl)
          urlTree.queryParams = {}
          urlTree.fragment = null
          this.router.navigate([urlTree.toString(), 'details', action.id])
        })
      )
    },
    { dispatch: false }
  )

  refreshSearchAfterCreateUpdate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AIProviderSearchActions.createAiproviderSucceeded, AIProviderSearchActions.updateAiproviderSucceeded),
      concatLatestFrom(() => this.store.select(AIProviderSearchSelectors.selectCriteria)),
      switchMap(([, searchCriteria]) => this.performSearch(searchCriteria))
    )
  })

  editButtonClicked$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AIProviderSearchActions.editAiproviderButtonClicked),
      concatLatestFrom(() => this.store.select(AIProviderSearchSelectors.selectResults)),
      map(([action, results]) => {
        return results.find((item) => item.id == action.id)
      }),
      mergeMap((itemToEdit) => {
        return this.portalDialogService.openDialog<AIProvider | undefined>(
          'AI_PROVIDER_CREATE_UPDATE.UPDATE.HEADER',
          {
            type: AIProviderCreateUpdateComponent,
            inputs: {
              vm: {
                itemToEdit
              }
            }
          },
          'AI_PROVIDER_CREATE_UPDATE.UPDATE.FORM.SAVE',
          'AI_PROVIDER_CREATE_UPDATE.UPDATE.FORM.CANCEL',
          {
            baseZIndex: 100
          }
        )
      }),
      switchMap((dialogResult) => {
        if (!dialogResult || dialogResult.button == 'secondary') {
          return of(AIProviderSearchActions.updateAiproviderCancelled())
        }
        if (!dialogResult?.result) {
          throw new Error('DialogResult was not set as expected!')
        }
        const itemToEditId = dialogResult.result.id
        const itemToEdit = {
          dataObject: dialogResult.result
        } as UpdateAIProvider
        return this.AIProviderService.updateAIProvider(itemToEditId, itemToEdit).pipe(
          map(() => {
            this.messageService.success({
              summaryKey: 'AI_PROVIDER_CREATE_UPDATE.UPDATE.SUCCESS'
            })
            return AIProviderSearchActions.updateAiproviderSucceeded()
          })
        )
      }),
      catchError((error) => {
        this.messageService.error({
          summaryKey: 'AI_PROVIDER_CREATE_UPDATE.UPDATE.ERROR'
        })
        return of(
          AIProviderSearchActions.updateAiproviderFailed({
            error
          })
        )
      })
    )
  })

  createButtonClicked$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AIProviderSearchActions.createAiproviderButtonClicked),
      switchMap(() => {
        return this.portalDialogService.openDialog<AIProvider | undefined>(
          'AI_PROVIDER_CREATE_UPDATE.CREATE.HEADER',
          {
            type: AIProviderCreateUpdateComponent,
            inputs: {
              vm: {
                itemToEdit: {}
              }
            }
          },
          'AI_PROVIDER_CREATE_UPDATE.CREATE.FORM.SAVE',
          'AI_PROVIDER_CREATE_UPDATE.CREATE.FORM.CANCEL',
          {
            baseZIndex: 100
          }
        )
      }),
      switchMap((dialogResult) => {
        if (!dialogResult || dialogResult.button == 'secondary') {
          return of(AIProviderSearchActions.createAiproviderCancelled())
        }
        if (!dialogResult?.result) {
          throw new Error('DialogResult was not set as expected!')
        }
        const toCreateItem = {
          dataObject: dialogResult.result
        } as CreateAIProvider
        return this.AIProviderService.createAIProvider(toCreateItem).pipe(
          map(() => {
            this.messageService.success({
              summaryKey: 'AI_PROVIDER_CREATE_UPDATE.CREATE.SUCCESS'
            })
            return AIProviderSearchActions.createAiproviderSucceeded()
          })
        )
      }),
      catchError((error) => {
        this.messageService.error({
          summaryKey: 'AI_PROVIDER_CREATE_UPDATE.CREATE.ERROR'
        })
        return of(
          AIProviderSearchActions.createAiproviderFailed({
            error
          })
        )
      })
    )
  })

  editDetailsButtonClicked$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AIProviderSearchActions.editAiproviderDetailsButtonClicked),
      concatLatestFrom(() => this.store.select(AIProviderSearchSelectors.selectResults)),
      map(([action, results]) => {
        return results.find((item) => item.id == action.id)
      }),
      switchMap((result) => {
        if (!result) {
          throw new Error('DialogResult was not set as expected!')
        }
        const itemToEditId = result.id
        const itemToEdit = {
          dataObject: result
        } as UpdateAIProvider
        return this.AIProviderService.updateAIProvider(itemToEditId, itemToEdit).pipe(
          map(() => {
            this.messageService.success({
              summaryKey: 'AI_PROVIDER_CREATE_UPDATE.UPDATE.SUCCESS'
            })
            return AIProviderSearchActions.updateAiproviderSucceeded()
          })
        )
      }),
      catchError((error) => {
        this.messageService.error({
          summaryKey: 'AI_PROVIDER_CREATE_UPDATE.UPDATE.ERROR'
        })
        return of(
          AIProviderSearchActions.updateAiproviderFailed({
            error
          })
        )
      })
    )
  })

  refreshSearchAfterDelete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AIProviderSearchActions.deleteAiproviderSucceeded),
      concatLatestFrom(() => this.store.select(AIProviderSearchSelectors.selectCriteria)),
      switchMap(([, searchCriteria]) => this.performSearch(searchCriteria))
    )
  })

  deleteButtonClicked$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AIProviderSearchActions.deleteAiproviderButtonClicked),
      concatLatestFrom(() => this.store.select(AIProviderSearchSelectors.selectResults)),
      map(([action, results]) => {
        return results.find((item) => item.id == action.id)
      }),
      mergeMap((itemToDelete) => {
        return this.portalDialogService
          .openDialog<unknown>(
            'AI_PROVIDER_DELETE.HEADER',
            'AI_PROVIDER_DELETE.MESSAGE',
            {
              key: 'AI_PROVIDER_DELETE.CONFIRM',
              icon: PrimeIcons.CHECK
            },
            {
              key: 'AI_PROVIDER_DELETE.CANCEL',
              icon: PrimeIcons.TIMES
            }
          )
          .pipe(
            map((state): [DialogState<unknown>, AIProvider | undefined] => {
              return [state, itemToDelete]
            })
          )
      }),
      switchMap(([dialogResult, itemToDelete]) => {
        if (!dialogResult || dialogResult.button == 'secondary') {
          return of(AIProviderSearchActions.deleteAiproviderCancelled())
        }
        if (!itemToDelete) {
          throw new Error('Item to delete not found!')
        }

        return this.AIProviderService.deleteAIProvider(itemToDelete.id).pipe(
          map(() => {
            this.messageService.success({
              summaryKey: 'AI_PROVIDER_DELETE.SUCCESS'
            })
            return AIProviderSearchActions.deleteAiproviderSucceeded()
          })
        )
      }),
      catchError((error) => {
        this.messageService.error({
          summaryKey: 'AI_PROVIDER_DELETE.ERROR'
        })
        return of(
          AIProviderSearchActions.deleteAiproviderFailed({
            error
          })
        )
      })
    )
  })

  searchByUrl$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigatedAction),
      filterForNavigatedTo(this.router, AIProviderSearchComponent),
      filterOutQueryParamsHaveNotChanged(this.router, AIProviderSearchCriteriasSchema, false),
      concatLatestFrom(() => this.store.select(AIProviderSearchSelectors.selectCriteria)),
      switchMap(([, searchCriteria]) => this.performSearch(searchCriteria))
    )
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  performSearch(searchCriteria: Record<string, any>) {
    return this.AIProviderService.searchAIProvider({
      ...Object.entries(searchCriteria).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: value instanceof Date ? value.toISOString() : value
        }),
        {}
      )
    }).pipe(
      map(({ results, totalNumberOfResults }) =>
        AIProviderSearchActions.aiproviderSearchResultsReceived({
          results,
          totalNumberOfResults
        })
      ),
      catchError((error) =>
        of(
          AIProviderSearchActions.aiproviderSearchResultsLoadingFailed({
            error
          })
        )
      )
    )
  }

  rehydrateChartVisibility$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigatedAction),
      filterForNavigatedTo(this.router, AIProviderSearchComponent),
      filterOutOnlyQueryParamsChanged(this.router),
      map(() =>
        AIProviderSearchActions.chartVisibilityRehydrated({
          visible: localStorage.getItem('aIProviderChartVisibility') === 'true'
        })
      )
    )
  })

  saveChartVisibility$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AIProviderSearchActions.chartVisibilityToggled),
        concatLatestFrom(() => this.store.select(AIProviderSearchSelectors.selectChartVisible)),
        tap(([, chartVisible]) => {
          localStorage.setItem('aIProviderChartVisibility', String(chartVisible))
        })
      )
    },
    { dispatch: false }
  )

  exportData$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AIProviderSearchActions.exportButtonClicked),
        concatLatestFrom(() => this.store.select(selectAIProviderSearchViewModel)),
        map(([, viewModel]) => {
          this.exportDataService.exportCsv(viewModel.displayedColumns, viewModel.results, 'AIProvider.csv')
        })
      )
    },
    { dispatch: false }
  )

  errorMessages: { action: Action; key: string }[] = [
    {
      action: AIProviderSearchActions.aiproviderSearchResultsLoadingFailed,
      key: 'AI_PROVIDER_SEARCH.ERROR_MESSAGES.SEARCH_RESULTS_LOADING_FAILED'
    }
  ]

  displayError$ = createEffect(
    () => {
      return this.actions$.pipe(
        tap((action) => {
          const e = this.errorMessages.find((e) => e.action.type === action.type)
          if (e) {
            this.messageService.error({ summaryKey: e.key })
          }
        })
      )
    },
    { dispatch: false }
  )
}
