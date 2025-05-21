import { IColumn } from '@/app/shared/table-primeng/table-primeng.component'
import { CurriculasComponent } from '../../curriculas.component'
import { payload } from '../types/curricula'
import { Validators } from '@angular/forms'

export const curriculasColumns: IColumn[] = [
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
        field: 'cCurrDescripcion',
        header: 'Nombre',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'cCurrRsl',
        header: 'Cursos',
        text_header: 'center',
        text: 'center',
    },
    {
        type: 'text',
        width: '5rem',
        field: 'iCurrNroHoras',
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
]

export function accionBtnContainerCurriculas(
    this: CurriculasComponent,
    { accion }
) {
    this.forms.curriculas.reset()
    this.forms.cursos.reset()

    clearValidators.call(this)

    switch (accion) {
        case 'agregar':
            this.dialogs.curriculas = {
                ...this.dialogs.curriculas,
                title: 'Agregar Curricula',
                visible: true,
            }

            addValidators.call(this)

            break

        default:
            break
    }
}

export function accionBtnCurriculas(
    this: CurriculasComponent,
    { accion, item }
) {
    this.forms.curriculas.reset()
    this.forms.cursos.reset()
    this.forms.assignCursosInNivelesGrados.reset()

    clearValidators.call(this)

    switch (accion) {
        case 'agregar':
            this.dialogs.curriculas = {
                ...this.dialogs.curriculas,
                title: 'Agregar Curricula',
                visible: true,
            }

            addValidators.call(this)

            break

        case 'editar':
            this.dialogs.curriculas = {
                ...this.dialogs.curriculas,
                title: 'Editar Curricula',
                visible: true,
            }

            setValues.call(this, item)

            this.cursosService.getCursos(item.iCurrId).subscribe({
                next: (res: any) => {
                    this.cursos.table.data = res.data
                },
            })

            break
        case 'nivelesCursos':
            this.dialogs.nivelesCursos.visible = true

            setValues.call(this, item)

            this.cursosService.getCursos(item.iCurrId).subscribe({
                next: (res: any) => {
                    this.cursos.table.data = res.data
                },
            })

            this.nivelesGradosService.getNivelGrados().subscribe({
                next: (res: any) => {
                    this.dropdowns.nivelesGrados = res.data.map((item) => ({
                        code: item.iNivelGradoId,
                        name: `${item.cNivelTipoNombre} - ${item.cGradoNombre}`,
                    }))
                },
            })

            break

        default:
            break
    }
}

function setValues(this: CurriculasComponent, item) {
    this.forms.curriculas.patchValue({
        iCurrId: item.iCurrId,
        iModalServId: item.iModalServId,
        iCurrNotaMinima: item.iCurrNotaMinima,
        iCurrTotalCreditos: item.iCurrTotalCreditos,
        iCurrNroHoras: item.iCurrNroHoras,
        cCurrPerfilEgresado: item.cCurrPerfilEgresado,
        cCurrMencion: item.cCurrMencion,
        nCurrPesoProcedimiento: item.nCurrPesoProcedimiento,
        cCurrPesoConceptual: item.cCurrPesoConceptual,
        cCurrPesoActitudinal: item.cCurrPesoActitudinal,
        bCurrEsLaVigente: item.bCurrEsLaVigente,
        cCurrRsl: item.cCurrRsl,
        dtCurrRsl: new Date(item.dtCurrRsl),
        cCurrDescripcion: item.cCurrDescripcion,
    })
}

export function curriculasSave(this: CurriculasComponent) {
    const formCurricula = this.forms.curriculas.value

    const payload: payload = {
        iModalServId: formCurricula.iModalServId,
        iCurrNotaMinima: Number(formCurricula.iCurrNotaMinima),
        iCurrTotalCreditos: Number(formCurricula.iCurrTotalCreditos),
        iCurrNroHoras: Number(formCurricula.iCurrNroHoras),
        cCurrPerfilEgresado: formCurricula.cCurrPerfilEgresado,
        cCurrMencion: formCurricula.cCurrMencion,
        nCurrPesoProcedimiento: Number(formCurricula.nCurrPesoProcedimiento),
        cCurrPesoConceptual: Number(formCurricula.cCurrPesoConceptual),
        cCurrPesoActitudinal: Number(formCurricula.cCurrPesoActitudinal),
        bCurrEsLaVigente: formCurricula.bCurrEsLaVigente,
        cCurrRsl: formCurricula.cCurrRsl,
        dtCurrRsl: formCurricula.dtCurrRsl,
        cCurrDescripcion: formCurricula.cCurrDescripcion,
    }

    if (!formCurricula.iCurrId) {
        return this.curriculasService.insCurriculas(payload)
    } else {
        return this.curriculasService.updCurriculas({
            ...payload,
            iCurrId: formCurricula.iCurrId,
        })
    }
}

export function validateFormCurricula(this: CurriculasComponent): boolean {
    let isValid = true

    fieldsValidate.forEach((field) => {
        const control = this.forms.curriculas.get(field as string)
        control?.markAsTouched()
        control?.markAsDirty()

        if (control && control.invalid) {
            isValid = false
        }
    })

    return isValid
}

const fieldsValidate: (keyof payload)[] = ['cCurrDescripcion']

function addValidators(this: CurriculasComponent) {
    fieldsValidate.forEach((field) => {
        this.forms.curriculas.get(field).setValidators([Validators.required])
        this.forms.curriculas.get(field).updateValueAndValidity()
    })
}

function clearValidators(this: CurriculasComponent) {
    fieldsValidate.forEach((field) => {
        this.forms.curriculas.get(field).clearValidators()
        this.forms.curriculas.get(field).updateValueAndValidity()
    })
}
