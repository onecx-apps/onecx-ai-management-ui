import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { addInitializeModuleGuard } from '@onecx/angular-integration-interface'
import { startsWith } from '@onecx/angular-webcomponents'
export const routes: Routes = [
  {
    matcher: startsWith('mcpserver'),
    loadChildren: () => import('./mcpserver/mcpserver.module').then((mod) => mod.MCPServerModule)
  },
  {
    matcher: startsWith('aicontext'),
    loadChildren: () => import('./ai-context/ai-context.module').then((mod) => mod.AiContextModule)
  },
  {
    matcher: startsWith('aiprovider'),
    loadChildren: () => import('./aiprovider/aiprovider.module').then((mod) => mod.AIProviderModule)
  }
]

@NgModule({
  imports: [RouterModule.forRoot(addInitializeModuleGuard(routes)), TranslateModule],
  exports: [RouterModule]
})
export class AppRoutingModule {}
