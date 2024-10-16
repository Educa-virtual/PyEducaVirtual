import { FormGroup } from '@angular/forms'

export const getInvalidControls = (form: FormGroup): string[] => {
    const invalidControls: string[] = []
    Object.keys(form.controls).forEach((controlName) => {
        if (form.get(controlName)?.invalid) {
            invalidControls.push(controlName)
        }
    })
    return invalidControls
}
