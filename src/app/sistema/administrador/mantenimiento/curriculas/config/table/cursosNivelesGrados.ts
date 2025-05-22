import { Validators } from '@angular/forms'
import { CurriculasComponent } from '../../curriculas.component'
import * as acciones from '../actions/table'
import { iCursosNivelesGrados } from '../types/cursosNivelesGrados'

export function accionBtnCursosNivelesGrados(
    this: CurriculasComponent,
    { accion, item }: { accion: keyof typeof acciones; item: any }
) {
    console.log(item)

    switch (accion) {
        case 'eliminar':
            break
    }
}

const filters: (keyof iCursosNivelesGrados['payload'])[] = ['iNivelGradoId']

export function asyncCursosNivelGrado(this: CurriculasComponent) {
    filters.forEach((field: keyof iCursosNivelesGrados['payload']) => {
        this.forms.cursosNivelesGrados
            .get(field)
            .valueChanges.subscribe((value) => {
                console.log(field)
                if (value == undefined || value == null) return

                if (field == 'iNivelGradoId' && value != null) {
                    console.log('get cursos nivel grado')

                    const nivelGrado = this.dropdowns.nivelesGrados.find(
                        (niv) => niv.code == value
                    )

                    console.log('nivelGrado')
                    console.log(nivelGrado)
                    console.log(this.forms.curriculas.value.iCurrId)
                    console.log(
                        this.forms.cursosNivelesGrados.get('iNivelGradoId')
                            .value
                    )
                    console.log(value)

                    this.nivelesGradosService
                        .getCursosNivelesGrados(
                            this.forms.curriculas.get('iCurrId')?.value,
                            this.forms.cursosNivelesGrados.get('iNivelGradoId')
                                ?.value
                        )
                        .subscribe({
                            next: (res: any) => {
                                this.cursosNivelesGrados.table.data = res.data
                            },
                        })
                }
            })
    })
}

export function save(this: CurriculasComponent, item) {
    const payload: iCursosNivelesGrados['payload'] = {
        iCursosNivelGradId: item.iCursosNivelGradId,
        iCursoId: item.iCursoId,
        iNivelGradoId: item.iNivelGradoId,
        nCursoHorasTeoria: item.nCursoHorasTeoria,
        nCursoHorasPractica: item.nCursoHorasPractica,
        cCursoDescripcion: item.cCursoDescripcion,
        nCursoTotalCreditos: item.nCursoTotalCreditos,
        cCursoPerfilDocente: item.cCursoPerfilDocente,
        iCursoTotalHoras: item.iCursoTotalHoras,
    }

    if (!item.iCursosNivelGradId) {
        return this.nivelesGradosService.insCursosNivelesGrados(payload)
    } else {
        return this.nivelesGradosService.updCursosNivelesGrados({
            ...payload,
            iCursosNivelGradId: item.iCursosNivelGradId,
        })
    }
}

export function validateFormCursos(this: CurriculasComponent): boolean {
    let isValid = true

    fieldsValidate.forEach((field) => {
        const control = this.forms.cursos.get(field as string)
        control?.markAsTouched()
        control?.markAsDirty()

        if (control && control.invalid) {
            isValid = false
        }
    })

    return isValid
}

const fieldsValidate: (keyof iCursosNivelesGrados['payload'])[] = [
    'iCursoId',
    'iNivelGradoId',
]

function addValidators(this: CurriculasComponent) {
    fieldsValidate.forEach((field) => {
        this.forms.cursosNivelesGrados
            .get(field)
            .setValidators([Validators.required])
        this.forms.cursosNivelesGrados.get(field).updateValueAndValidity()
    })
}

function clearValidators(this: CurriculasComponent) {
    fieldsValidate.forEach((field) => {
        this.forms.cursosNivelesGrados.get(field).clearValidators()
        this.forms.cursosNivelesGrados.get(field).updateValueAndValidity()
    })
}

export const cursosNivelesGrados = {
    fieldsValidate,
    addValidators,
    clearValidators,
    save,
}
