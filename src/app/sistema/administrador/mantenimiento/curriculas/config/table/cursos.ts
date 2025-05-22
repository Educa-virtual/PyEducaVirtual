import { TableColumn } from '@/app/shared/table-primeng/table-primeng.component'
import { CurriculasComponent } from '../../curriculas.component'
import { iCursos } from '../types/cursos'
import { Validators } from '@angular/forms'
import { cursosNivelesGrados } from './cursosNivelesGrados'
import { FormPatch } from '../types/forms'

export const cursosColumns: TableColumn = {
    inTableColumnsGroup: [
        [
            {
                type: 'text',
                width: '5rem',
                text_header: 'center',
                field: '',
                header: 'ITEM',
                text: 'center',
                colspan: 1,
                rowspan: 2,
            },
        ],
        [
            {
                type: 'text',
                width: '5rem',
                text_header: 'center',
                field: 'B11',
                header: 'ITEM',
                text: 'center',
                colspan: 1,
                rowspan: 2,
            },
        ],
    ],
    inTableColumns: [
        {
            type: 'item',
            width: '5rem',
            field: '',
            header: 'Item',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cCursoNombre',
            header: 'Nombre',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'nCursoTotalCreditos',
            header: 'Créditos totales',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'iCursoTotalHoras',
            header: 'Horas totales',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'estado-activo',
            width: '5rem',
            field: 'iEstado',
            header: 'Estado',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'actions',
            width: '3rem',
            field: 'actions',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ],
}

export function accionBtnCursos(
    this: CurriculasComponent,
    { accion, item }: { accion; item: any }
) {
    this.forms.cursos.reset()

    cursos.clearValidators.call(this)
    cursosNivelesGrados.clearValidators.call(this)

    switch (accion) {
        case 'agregar':
            this.dialogs.cursos = {
                ...this.dialogs.curriculas,
                title: 'Agregar curso',
                visible: true,
            }
            addValidators.call(this)

            break
        case 'editar':
            this.forms.cursos.reset()

            this.cursos.container.actions = []

            this.dialogs.cursos = {
                ...this.dialogs.cursos,
                title: 'Editar curso',
                visible: true,
            }

            console.log('item')
            console.log(item)

            setValues.call(this, item)

            break

        case 'assignCursosInNivelesGrados':
            // Object.keys(
            //     this.forms.assignCursosInNivelesGrados.controls
            // ).forEach((field) => {
            //     const control =
            //         this.forms.assignCursosInNivelesGrados.get(field)
            //     control?.markAsTouched() // Marca como tocado (touched)
            //     control?.markAsDirty() // Marca como modificado (dirty)
            // })

            // if (this.forms.assignCursosInNivelesGrados.invalid) return

            console.log('assign')

            this.dialogs.cursosNivelesCursos = {
                title: 'Asignar cursos a niveles y grados',
                visible: true,
            }

            const patch: FormPatch = {
                cursos: [
                    'cCursoImagen',
                    'cCursoNombre',
                    'cCursoPerfilDocente',
                    'iCurrId',
                    'iCursoId',
                    'iEstado',
                    'iTipoCursoId',
                    'nCursoCredPractica',
                    'nCursoCredTeoria',
                ],
            }

            patchValues.call(this, item, patch)

            cursos.disabledFields.call(this)

            cursosNivelesGrados.addValidators.call(this)

            break

        default:
            break
    }
}

function setValues(this: CurriculasComponent, item) {
    this.forms.cursos.setValue({
        iCursoId: item.iCursoId,
        iCurrId: item.iCurrId,
        iTipoCursoId: item.iTipoCursoId,
        cCursoNombre: item.cCursoNombre,
        nCursoCredTeoria: item.nCursoCredTeoria,
        nCursoCredPractica: item.nCursoCredPractica,
        cCursoDescripcion: item.cCursoDescripcion,
        nCursoTotalCreditos: item.nCursoTotalCreditos,
        cCursoPerfilDocente: item.cCursoPerfilDocente,
        iCursoTotalHoras: item.iCursoTotalHoras,
        iEstado: Number(item.iEstado),
        cCursoImagen: item.cCursoImagen,
    })
}

function patchValues(
    this: CurriculasComponent,
    item: any,
    fields: (keyof iCursos['payload'])[]
) {
    const valuesToPatch: { [key: string]: any } = {}

    fields.forEach((field) => {
        if (field in item) {
            valuesToPatch[field] = item[field]
        }
    })

    this.forms.cursos.patchValue(valuesToPatch)
}

export function cursosSave(this: CurriculasComponent, item) {
    console.log('item')
    console.log(item)

    const payload: iCursos['payload'] = {
        iCurrId: item.iCurrId,
        iTipoCursoId: item.iTipoCursoId,
        cCursoNombre: item.cCursoNombre,
        nCursoCredTeoria: item.nCursoCredTeoria,
        nCursoCredPractica: item.nCursoCredPractica,
        cCursoDescripcion: item.cCursoDescripcion,
        nCursoTotalCreditos: item.nCursoTotalCreditos,
        cCursoPerfilDocente: item.cCursoPerfilDocente,
        iCursoTotalHoras: item.iCursoTotalHoras,
        iEstado: Number(item.iEstado),
        cCursoImagen: item.cCursoImagen,
    }

    if (!item.iCursoId) {
        return this.cursosService.insCursos(payload)
    } else {
        return this.cursosService.updCursos({
            ...payload,
            iCursoId: item.iCursoId,
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

const fieldsValidate: (keyof iCursos['payload'])[] = ['cCursoNombre']

function addValidators(this: CurriculasComponent) {
    fieldsValidate.forEach((field) => {
        this.forms.cursos.get(field).setValidators([Validators.required])
        this.forms.cursos.get(field).updateValueAndValidity()
    })
}

function clearValidators(this: CurriculasComponent) {
    fieldsValidate.forEach((field) => {
        this.forms.cursos.get(field).clearValidators()
        this.forms.cursos.get(field).updateValueAndValidity()
    })
}

function disabledFields(this: CurriculasComponent) {
    const controls = this.forms.cursos.controls

    Object.keys(controls).forEach((field) => {
        this.forms.cursos.get(field).disable()
    })
}

export const cursos = {
    fieldsValidate,
    addValidators,
    clearValidators,
    disabledFields,
    patchValues,
}
