import { PrimengModule } from '@/app/primeng.module';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-input-simple',
  standalone: true,
  imports: [PrimengModule, TextFieldModule],
  templateUrl: './input-simple.component.html',
  styleUrl: './input-simple.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: InputSimpleComponent,
    },
  ],
})
export class InputSimpleComponent implements OnInit {
  @Input() inputControl: FormControl;

  @Input() addonLabel: string = 'Campo';

  @Input() inputPlaceholder: string = 'Especifique';
  @Input() inputType: 'text' | 'number' | 'textarea' | 'date' = 'text';
  @Input() inputRequired: boolean = false;
  @Input() inputReadonly: boolean = false;

  @Input() inputMaxlength: number = null;
  @Input() inputMin: number = 1;
  @Input() inputMax: number = null;
  @Input() inputStep: number = 1;
  @Input() inputUseGrouping: boolean = false;
  @Input() inputShowButtons: boolean = false;

  @Input() inputInitRows: number = 3;
  @Input() inputMinRows: number = 3;
  @Input() inputMaxRows: number = 6;

  @Input() infoAdicional!: TemplateRef<any>;

  @Input() inputMinDate: Date = new Date(1900, 0, 1);
  @Input() inputMaxDate: Date = new Date();

  @Input() inputNumberPrefix: string | null = null;
  @Input() inputNumberSuffix: string | null = null;

  inputMinRowsString: string;
  inputMaxRowsString: string;

  onChange = () => {};
  onTouched = () => {};
  touched = false;
  disabled = false;

  ngOnInit() {
    this.inputMinRowsString = `${this.inputMinRows}lh`;
    this.inputMaxRowsString = `${this.inputMaxRows}lh`;
  }

  writeValue(value: any) {
    if (value) {
      this.inputControl.setValue(value); // Assign the values to the Switch
    } else {
      this.inputControl.setValue(null); // Reset if value is null or undefined
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
