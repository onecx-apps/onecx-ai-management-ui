import { Component, EventEmitter, Input, OnInit } from '@angular/core'
import { DialogButtonClicked, DialogPrimaryButtonDisabled, DialogResult } from '@onecx/portal-integration-angular'

import { FormControl, FormGroup, Validators } from '@angular/forms'
import { map } from 'rxjs'
import { AIProvider } from 'src/app/shared/generated'

import { AIProviderCreateUpdateViewModel } from './aiprovider-create-update.viewmodel'

@Component({
  selector: 'app-aiprovider-create-update',
  templateUrl: './aiprovider-create-update.component.html',
  styleUrls: ['./aiprovider-create-update.component.scss']
})
export class AIProviderCreateUpdateComponent
  implements
    DialogPrimaryButtonDisabled,
    DialogResult<AIProvider | undefined>,
    DialogButtonClicked<AIProviderCreateUpdateComponent>,
    OnInit
{
  @Input() public vm: AIProviderCreateUpdateViewModel = {
    itemToEdit: undefined
  }

  public formGroup: FormGroup

  primaryButtonEnabled = new EventEmitter<boolean>()
  dialogResult: AIProvider | undefined = undefined

  constructor() {
    this.formGroup = new FormGroup({
      name: new FormControl(null, [Validators.maxLength(255)]),
      description: new FormControl(null, [Validators.maxLength(255)]),
      appId: new FormControl(null, [Validators.maxLength(255)])
    })
    this.formGroup.statusChanges
      .pipe(
        map((status) => {
          return status === 'VALID'
        })
      )
      .subscribe(this.primaryButtonEnabled)
  }

  ocxDialogButtonClicked() {
    this.dialogResult = {
      ...this.vm.itemToEdit,
      ...this.formGroup.value
    }
  }

  ngOnInit() {
    if (this.vm.itemToEdit) {
      this.formGroup.patchValue({
        ...this.vm.itemToEdit
      })
    }
  }
}
