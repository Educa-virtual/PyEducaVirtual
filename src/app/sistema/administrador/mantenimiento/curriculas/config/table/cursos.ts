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
