import { ComponentHarness } from '@angular/cdk/testing'
import { PageHeaderHarness } from '@onecx/angular-accelerator/testing'

export class AIProviderDetailsHarness extends ComponentHarness {
  static hostSelector = 'app-aiprovider-details'

  getHeader = this.locatorFor(PageHeaderHarness)
}
