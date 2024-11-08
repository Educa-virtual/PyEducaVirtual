import { AbstractControl, FormArray, ValidatorFn } from '@angular/forms'

export function almenosUnNivelActivo(): ValidatorFn {
    return (formArray: AbstractControl): { [key: string]: boolean } | null => {
        if (!(formArray instanceof FormArray)) {
            return null
        }

        const isAnyGroupActive = formArray.controls.some(
            (control) => control.value.bActivo
        )

        // Retorna un error si no hay ningún grupo activo
        return isAnyGroupActive ? null : { noActiveGroup: true }
    }
}
