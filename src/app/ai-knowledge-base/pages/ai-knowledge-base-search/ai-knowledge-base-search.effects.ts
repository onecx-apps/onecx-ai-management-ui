import { Injectable, SkipSelf } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { concatLatestFrom } from '@ngrx/operators'
import { routerNavigatedAction } from '@ngrx/router-store'
import { Action, Store } from '@ngrx/store'
import { filterForNavigatedTo, filterOutQueryParamsHaveNotChanged } from '@onecx/ngrx-accelerator'
import { ExportDataService, PortalMessageService } from '@onecx/portal-integration-angular'
import equal from 'fast-deep-equal'
import { catchError, map, of, switchMap, tap } from 'rxjs'
import { selectUrl } from 'src/app/shared/selectors/router.selectors'
import { AiKnowledgeBaseBffService } from '../../../shared/generated'
import { AiKnowledgeBaseSearchActions } from './ai-knowledge-base-search.actions'
import { AiKnowledgeBaseSearchComponent } from './ai-knowledge-base-search.component'
import { aiKnowledgeBaseSearchCriteriasSchema } from './ai-knowledge-base-search.parameters'
import {
  aiKnowledgeBaseSearchSelectors,
  selectAiKnowledgeBaseSearchViewModel
} from './ai-knowledge-base-search.selectors'

@Injectable()
export class AiKnowledgeBaseSearchEffects {
  constructor(
    private actions$: Actions,
    @SkipSelf() private route: ActivatedRoute,
    private aiKnowledgeBaseService: AiKnowledgeBaseBffService,
    private router: Router,
    private store: Store,
    private messageService: PortalMessageService,
    private readonly exportDataService: ExportDataService
  ) {}

  syncParamsToUrl$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AiKnowledgeBaseSearchActions.searchButtonClicked, AiKnowledgeBaseSearchActions.resetButtonClicked),
        concatLatestFrom(() => [
          this.store.select(aiKnowledgeBaseSearchSelectors.selectCriteria),
          this.route.queryParams
        ]),
        tap(([, criteria, queryParams]) => {
          const results = aiKnowledgeBaseSearchCriteriasSchema.safeParse(queryParams)
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
        ofType(AiKnowledgeBaseSearchActions.detailsButtonClicked),
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

  searchByUrl$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigatedAction),
      filterForNavigatedTo(this.router, AiKnowledgeBaseSearchComponent),
      filterOutQueryParamsHaveNotChanged(this.router, aiKnowledgeBaseSearchCriteriasSchema, false),
      concatLatestFrom(() => this.store.select(aiKnowledgeBaseSearchSelectors.selectCriteria)),
      switchMap(([, searchCriteria]) => this.performSearch(searchCriteria))
    )
  })

  performSearch(searchCriteria: Record<string, any>) {
    return this.aiKnowledgeBaseService
      .searchAiKnowledgeBases({
        ...Object.entries(searchCriteria).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [key]: value instanceof Date ? value.toISOString() : value
          }),
          {}
        )
      })
      .pipe(
        map(({ stream, size, number, totalElements, totalPages }) =>
          AiKnowledgeBaseSearchActions.aiKnowledgeBaseSearchResultsReceived({
            stream,
            size,
            number,
            totalElements,
            totalPages
          })
        ),
        catchError((error) =>
          of(
            AiKnowledgeBaseSearchActions.aiKnowledgeBaseSearchResultsLoadingFailed({
              error
            })
          )
        )
      )
  }

  exportData$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AiKnowledgeBaseSearchActions.exportButtonClicked),
        concatLatestFrom(() => this.store.select(selectAiKnowledgeBaseSearchViewModel)),
        map(([, viewModel]) => {
          this.exportDataService.exportCsv(
            viewModel.resultComponentState?.displayedColumns ?? [],
            viewModel.results,
            'AiKnowledgeBase.csv'
          )
        })
      )
    },
    { dispatch: false }
  )

  errorMessages: { action: Action; key: string }[] = [
    {
      action: AiKnowledgeBaseSearchActions.aiKnowledgeBaseSearchResultsLoadingFailed,
      key: 'AI_KNOWLEDGE_BASE_SEARCH.ERROR_MESSAGES.SEARCH_RESULTS_LOADING_FAILED'
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
