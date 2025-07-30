import { PrimengModule } from '@/app/primeng.module';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-pregunta-abierta',
  standalone: true,
  imports: [PrimengModule, TextFieldModule],
  templateUrl: './pregunta-abierta.component.html',
  styleUrl: './pregunta-abierta.component.scss',
  providers: [],
})
export class PreguntaAbiertaComponent implements OnInit {
  @Input() inputControl: FormControl;

  @Input() addonLabel: string = 'Campo';

  @Input() inputPlaceholder: string = 'Responda';

  @Input() inputInitRows: number = 3;
  @Input() inputMinRows: number = 3;
  @Input() inputMaxRows: number = 6;

  @Input() infoAdicional!: TemplateRef<any>;

  @Input() controlDisabled: boolean = false;

  inputMinRowsString: string;
  inputMaxRowsString: string;

  onChange = () => {};
  onTouched = () => {};
  touched = false;
  disabled = false;

  ngOnInit() {
    this.inputMinRowsString = `${this.inputMinRows}lh`;
    this.inputMaxRowsString = `${this.inputMaxRows}lh`;
    if (this.controlDisabled) {
      this.inputControl.disable();
    }
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
