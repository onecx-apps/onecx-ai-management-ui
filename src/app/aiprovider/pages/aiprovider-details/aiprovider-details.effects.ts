import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { concatLatestFrom } from '@ngrx/operators'
import { routerNavigatedAction } from '@ngrx/router-store'
import { Action, Store } from '@ngrx/store'
import { filterForNavigatedTo } from '@onecx/ngrx-accelerator'
import { PortalMessageService } from '@onecx/portal-integration-angular'
import { catchError, map, of, switchMap, tap } from 'rxjs'
import { selectRouteParam } from 'src/app/shared/selectors/router.selectors'
import { AIProviderDetailsActions } from './aiprovider-details.actions'
import { AIProviderDetailsComponent } from './aiprovider-details.component'
import { AIProviderBffService } from 'src/app/shared/generated/api/aIProviderBffService.service'

@Injectable()
export class AIProviderDetailsEffects {
  constructor(
    private actions$: Actions,
    private aIProviderService: AIProviderBffService,
    private router: Router,
    private store: Store,
    private messageService: PortalMessageService
  ) {}

  navigatedToDetailsPage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigatedAction),
      filterForNavigatedTo(this.router, AIProviderDetailsComponent),
      concatLatestFrom(() => this.store.select(selectRouteParam('id'))),
      map(([, id]) => {
        return AIProviderDetailsActions.navigatedToDetailsPage({
          id
        })
      })
    )
  })

  loadAIProviderById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AIProviderDetailsActions.navigatedToDetailsPage),
      switchMap(({ id }) =>
        this.aIProviderService.getAIProviderById(id ?? '').pipe(
          map(({ result }) =>
            AIProviderDetailsActions.aiproviderDetailsReceived({
              details: result
            })
          ),
          catchError((error) =>
            of(
              AIProviderDetailsActions.aiproviderDetailsLoadingFailed({
                error
              })
            )
          )
        )
      )
    )
  })

  errorMessages: { action: Action; key: string }[] = [
    {
      action: AIProviderDetailsActions.aiproviderDetailsLoadingFailed,
      key: 'AI_PROVIDER_DETAILS.ERROR_MESSAGES.DETAILS_LOADING_FAILED'
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
