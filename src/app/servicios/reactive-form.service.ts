import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ReactiveFormService {
  constructor() {}

  /**
   * Poner formulario en estado inválido
   * @param form El nombre del formulario
   */
  validarFormulario(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      form.get(key)?.markAsDirty();
      form.get(key)?.markAsTouched();
      form.get(key)?.updateValueAndValidity();
    });
  }

  /**
   * Convertir un array de formulario en array con llaves o JSON con llaves
   * @param form El formulario
   * @param formJson El control destino del formulario
   * @param formControlName El control o array de controles origen del formulario
   * @param groupControl El nombre de la llave, dejar en blanco para no usar, nulo para usar nombre del control
   * @param devolverArray true para devolver array, false (defecto) para devolver json
   * @returns
   */
  formControlJsonStringify(
    form: FormGroup,
    formJson: string,
    formControlName: string | string[] | null,
    groupControl: string | null = null,
    devolverArray: boolean = false
  ): void {
    form.get(formJson).setValue(null);
    if (!formControlName) {
      return null;
    }
    const items = [];
    if (typeof formControlName === 'string') {
      formControlName = [formControlName];
    }
    formControlName.forEach(control => {
      if (form.get(control).value === null) {
        return null;
      }
      form.get(control).value.forEach(item => {
        if (groupControl) {
          items.push({
            [groupControl]: String(item),
          });
        } else if (groupControl == '') {
          items.push(item);
        } else {
          items.push({
            [control]: String(item),
          });
        }
      });
    });
    form.get(formJson).setValue(devolverArray ? items : JSON.stringify(items));
  }

  /**
   * Formatear un control de un formulario
   * @param form El formulario
   * @param formControl El control del formulario
   * @param value El valor del control
   * @param tipo El tipo del control
   * @param groupControl El control por el que se agrupan los datos en el json, por defecto es null
   */
  formatearFormControl(
    form: FormGroup,
    formControl: string,
    value: any,
    tipo: 'number' | 'string' | 'json' | 'boolean' | 'date' | 'time',
    groupControl: string | null = null
  ): void {
    if (tipo === 'number') {
      if (!value || isNaN(Number(value))) {
        value = null;
      } else {
        value = +value;
      }
      form.get(formControl).patchValue(value);
    } else if (tipo === 'boolean') {
      if (!value || isNaN(Number(value))) value = 0;
      form.get(formControl)?.patchValue(value == 1 ? true : false);
    } else if (tipo === 'string') {
      if (!value) value = null;
      form.get(formControl)?.patchValue(value);
    } else if (tipo === 'date') {
      let fecha = null;
      if (value) {
        value = value.substring(0, 10);
        fecha = new Date(value + 'T00:00:00');
      }
      form.get(formControl)?.patchValue(fecha);
    } else if (tipo === 'time') {
      let time = null;
      if (value) {
        time = value.substring(0, 5);
      }
      form.get(formControl)?.patchValue(time);
    } else if (tipo === 'json') {
      if (!value) {
        form.get(formControl)?.patchValue(null);
      } else {
        const json = JSON.parse(value);
        const items = [];
        for (let i = 0; i < json.length; i++) {
          if (groupControl) {
            items.push(json[i][groupControl]);
          } else {
            items.push(json[i][formControl]);
          }
        }
        form.get(formControl)?.patchValue(items);
      }
    } else {
      if (!value) value = null;
      form.get(formControl)?.patchValue(value);
    }
  }
}
