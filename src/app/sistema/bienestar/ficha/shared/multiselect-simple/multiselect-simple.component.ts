import { PrimengModule } from '@/app/primeng.module';
import { Component, Input, TemplateRef } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-multiselect-simple',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './multiselect-simple.component.html',
  styleUrl: './multiselect-simple.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: MultiselectSimpleComponent,
    },
  ],
})
export class MultiselectSimpleComponent {
  @Input() multiselectItems: Array<object>;
  @Input() multiselectPlaceholder: string = 'Seleccione';

  @Input() multiselectControl: FormControl;

  @Input() addonLabel: string = 'Campo';

  @Input() filter: boolean = true;
  @Input() showClear: boolean = true;
  @Input() showToggleAll: boolean = false;

  @Input() infoAdicional!: TemplateRef<any>;

  onChange = () => {};
  onTouched = () => {};
  touched = false;
  disabled = false;

  writeValue(value: any) {
    if (value) {
      this.multiselectControl.setValue(value); // Assign the values to the MultiSelect
    } else {
      this.multiselectControl.setValue(null); // Reset if value is null or undefined
    }
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }
}
