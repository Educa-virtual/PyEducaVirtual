import { Injectable, OnDestroy } from '@angular/core'
import { Subject } from 'rxjs'
import { FormGroup } from '@angular/forms'

@Injectable({
    providedIn: 'root',
})
export class FuncionesBienestarService implements OnDestroy {
    private onDestroy$ = new Subject<boolean>()

    constructor() {}

    /**
     *
     * @param form El nombre del formulario
     * @param formControl El nombre del control del formulario
     * @param value El valor del control
     * @param tipo El tipo del control
     * @param groupControl El control por el que se agrupan los datos en el json, por defecto es null
     */
    formatearFormControl(
        form: FormGroup,
        formControl: string,
        value: any,
        tipo: 'number' | 'string' | 'json' | 'boolean' | 'date',
        groupControl: string | null = null
    ) {
        if (tipo === 'number') {
            if (!value || isNaN(Number(value))) {
                value = null
            } else {
                value = +value
            }
            form.get(formControl).patchValue(value)
        } else if (tipo === 'boolean') {
            if (!value || isNaN(Number(value))) value = 0
            form.get(formControl)?.patchValue(value == 1 ? true : false)
        } else if (tipo === 'string') {
            if (!value) value = null
            form.get(formControl)?.patchValue(value)
        } else if (tipo === 'date') {
            if (!value) value = null
            const fecha = new Date(value)
            form.get(formControl)?.patchValue(fecha)
        } else if (tipo === 'json') {
            if (!value) {
                form.get(formControl)?.patchValue(null)
            } else {
                const json = JSON.parse(value)
                const items = []
                for (let i = 0; i < json.length; i++) {
                    if (groupControl) {
                        items.push(json[i][groupControl])
                    } else {
                        items.push(json[i][formControl])
                    }
                }
                form.get(formControl)?.patchValue(items)
            }
        } else {
            if (!value) value = null
            form.get(formControl)?.patchValue(value)
        }
    }

    /**
     * Funcion para guardar los datos de un grupo de controles en un control de json
     * @param form El nombre del formulario
     * @param formJson El control del formulario que contiene el json
     * @param formControlName El control o los controles del formulario que contienen los datos a guardar
     * @param groupControl El control por el que se agrupan los datos en el json, por defecto es null
     */
    formControlJsonStringify(
        form: FormGroup,
        formJson: string,
        formControlName: string | string[] | null,
        groupControl: string | null = null
    ): void {
        form.get(formJson).setValue(null)
        if (!formControlName) {
            return null
        }
        const items = []
        if (typeof formControlName === 'string') {
            formControlName = [formControlName]
        }
        formControlName.forEach((control) => {
            if (form.get(control).value === null) {
                return null
            }
            form.get(control).value.forEach((item) => {
                if (groupControl) {
                    items.push({
                        [groupControl]: item,
                    })
                } else if (groupControl == '') {
                    items.push(item)
                } else {
                    items.push({
                        [control]: item,
                    })
                }
            })
        })
        form.get(formJson).setValue(JSON.stringify(items))
    }

    formMarkAsDirty(form: FormGroup) {
        if (form) {
            form.markAllAsTouched()
            Object.keys(form.controls).forEach((key) => {
                form.get(key)?.markAsDirty()
            })
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next(true)
        this.onDestroy$.complete()
    }
}
