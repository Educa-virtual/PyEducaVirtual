import { TableColumn } from '@/app/shared/table-primeng/table-primeng.component'
import { CurriculasComponent } from '../../curriculas.component'
import { payload } from '../types/cursos'

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
            field: 'iCursoEstado',
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

export function accionBtnContainerCursos(
    this: CurriculasComponent,
    { accion }
) {
    this.forms.cursos.reset()

    switch (accion) {
        case 'agregar':
            this.dialogs.cursos = {
                ...this.dialogs.curriculas,
                title: 'Agregar curso',
                visible: true,
            }
            break

        default:
            break
    }
}

export function cursosAccionBtnTable(
    this: CurriculasComponent,
    { accion, item }
) {
    console.log(accion)

    switch (accion) {
        case 'editar':
            this.forms.cursos.reset()

            this.cursos.container.actions = []

            this.dialogs.cursos = {
                ...this.dialogs.cursos,
                title: 'Editar curso',
                visible: true,
            }

            setValues.call(this, item)

            break

        case 'assignCursosInNivelesGrados':
            Object.keys(
                this.forms.assignCursosInNivelesGrados.controls
            ).forEach((field) => {
                const control =
                    this.forms.assignCursosInNivelesGrados.get(field)
                control?.markAsTouched() // Marca como tocado (touched)
                control?.markAsDirty() // Marca como modificado (dirty)
            })

            if (this.forms.assignCursosInNivelesGrados.invalid) return

            break

        default:
            break
    }
}

function setValues(this: CurriculasComponent, item) {
    this.forms.cursos.setValue({
        iCurrId: item.iCurrId,
        iTipoCursoId: item.iTipoCursoId,
        cCursoNombre: item.cCursoNombre,
        nCursoCredTeoria: item.nCursoCredTeoria,
        nCursoCredPractica: item.nCursoCredPractica,
        cCursoDescripcion: item.cCursoDescripcion,
        nCursoTotalCreditos: item.nCursoTotalCreditos,
        cCursoPerfilDocente: item.cCursoPerfilDocente,
        iCursoTotalHoras: item.iCursoTotalHoras,
        iCursoEstado: item.iCursoEstado,
        cCursoImagen: item.cCursoImagen,
    })
}

export function cursosSave(this: CurriculasComponent) {
    const formCurso = this.forms.curriculas.value

    const payload: payload = {
        iCurrId: formCurso.iCurrId,
        iTipoCursoId: formCurso.iTipoCursoId,
        cCursoNombre: formCurso.cCursoNombre,
        nCursoCredTeoria: formCurso.nCursoCredTeoria,
        nCursoCredPractica: formCurso.nCursoCredPractica,
        cCursoDescription: formCurso.cCursoDescription,
        nCursoTotalCreditos: formCurso.nCursoTotalCreditos,
        cCursoPerfilDocente: formCurso.cCursoPerfilDocente,
        iCursoTotalHoras: formCurso.iCursoTotalHoras,
        iCursoEstado: formCurso.iCursoEstado,
        cCursoImagen: formCurso.cCursoImagen,
    }

    if (!formCurso.iCurrId) {
        return this.cursosService.insCursos(payload)
    } else {
        return this.cursosService.insCursos({
            ...payload,
            iCursoId: formCurso.iCursoId,
        })
    }
}
