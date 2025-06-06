import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { LetDirective } from '@ngrx/component'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'
import { TranslateModule } from '@ngx-translate/core'
import { addInitializeModuleGuard, PortalCoreModule } from '@onecx/portal-integration-angular'
import { CalendarModule } from 'primeng/calendar'
import { SharedModule } from '../shared/shared.module'
import { aiContextFeature } from './ai-context.reducers'
import { routes } from './ai-context.routes'
import { AiContextSearchComponent } from './pages/ai-context-search/ai-context-search.component'
import { AiContextSearchEffects } from './pages/ai-context-search/ai-context-search.effects'
import { AiContextCreateUpdateComponent } from './pages/ai-context-search/dialogs/ai-context-create-update/ai-context-create-update.component'

@NgModule({
  declarations: [AiContextCreateUpdateComponent, AiContextSearchComponent],
  imports: [
    CommonModule,
    SharedModule,
    LetDirective,
    PortalCoreModule.forMicroFrontend(),
    RouterModule.forChild(addInitializeModuleGuard(routes)),
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    StoreModule.forFeature(aiContextFeature),
    EffectsModule.forFeature([AiContextSearchEffects]),
    TranslateModule
  ]
})
export class AiContextModule {}
