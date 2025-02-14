import { CommonModule } from '@angular/common'
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { LetDirective } from '@ngrx/component'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'
import { TranslateModule } from '@ngx-translate/core'
import { addInitializeModuleGuard } from '@onecx/angular-integration-interface'
import { PortalCoreModule, providePortalDialogService } from '@onecx/portal-integration-angular'
import { CalendarModule } from 'primeng/calendar'
import { SharedModule } from '../shared/shared.module'
import { AIProviderFeature } from './aiprovider.reducers'
import { routes } from './aiprovider.routes'
import { AIProviderDetailsComponent } from './pages/aiprovider-details/aiprovider-details.component'
import { AIProviderDetailsEffects } from './pages/aiprovider-details/aiprovider-details.effects'
import { AIProviderSearchComponent } from './pages/aiprovider-search/aiprovider-search.component'
import { AIProviderSearchEffects } from './pages/aiprovider-search/aiprovider-search.effects'
import { AIProviderCreateUpdateComponent } from './pages/aiprovider-search/dialogs/aiprovider-create-update/aiprovider-create-update.component'

@NgModule({
  providers: [providePortalDialogService()],
  declarations: [
    AIProviderCreateUpdateComponent,
    AIProviderDetailsComponent,
    AIProviderSearchComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    SharedModule,
    LetDirective,
    PortalCoreModule.forMicroFrontend(),
    RouterModule.forChild(addInitializeModuleGuard(routes)),
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    StoreModule.forFeature(AIProviderFeature),
    EffectsModule.forFeature([AIProviderDetailsEffects, AIProviderSearchEffects]),
    TranslateModule
  ]
})
export class AIProviderModule {}
