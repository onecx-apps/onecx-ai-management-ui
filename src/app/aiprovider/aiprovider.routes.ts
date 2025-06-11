import { Routes } from '@angular/router'
import { AIProviderDetailsComponent } from './pages/aiprovider-details/aiprovider-details.component'
import { AIProviderSearchComponent } from './pages/aiprovider-search/aiprovider-search.component'

export const routes: Routes = [
  { path: 'details/:id', component: AIProviderDetailsComponent, pathMatch: 'full' },
  { path: '', component: AIProviderSearchComponent, pathMatch: 'full' }
]
