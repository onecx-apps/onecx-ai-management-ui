import { CommonModule } from '@angular/common'
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { LetDirective } from '@ngrx/component'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'
import { TranslateModule } from '@ngx-translate/core'
import { addInitializeModuleGuard, PortalCoreModule } from '@onecx/portal-integration-angular'
import { CalendarModule } from 'primeng/calendar'
import { SharedModule } from '../shared/shared.module'
import { aIKnowledgeBaseFeature } from './aiknowledge-base.reducers'
import { routes } from './aiknowledge-base.routes'
import { AIKnowledgeBaseSearchComponent } from './pages/aiknowledge-base-search/aiknowledge-base-search.component'
import { AIKnowledgeBaseSearchEffects } from './pages/aiknowledge-base-search/aiknowledge-base-search.effects'

@NgModule({
  declarations: [AIKnowledgeBaseSearchComponent],
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
    StoreModule.forFeature(aIKnowledgeBaseFeature),
    EffectsModule.forFeature([AIKnowledgeBaseSearchEffects]),
    TranslateModule
  ]
})
export class AIKnowledgeBaseModule {}
