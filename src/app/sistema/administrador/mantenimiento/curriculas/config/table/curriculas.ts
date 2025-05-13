import { IActionContainer } from '@/app/shared/container-page/container-page.component'
import { IColumn } from '@/app/shared/table-primeng/table-primeng.component'
import { CurriculasComponent } from '../../curriculas.component'
import { payload } from '../types/curricula'

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

export const curriculasContainerActions: IActionContainer[] = [
    {
        labelTooltip: 'Añadir',
        text: 'Añadir',
        icon: 'pi pi-plus',
        accion: 'agregar',
        class: 'p-button-primary',
    },
]

export function accionBtnContainer(this: CurriculasComponent, { accion }) {
    this.forms.curriculas.reset()

    switch (accion) {
        case 'agregar':
            this.dialogVisible.curricula = true
            this.modal = {
                title: 'Agregar Curricula',
                type: 'curricula',
            }
            break

        default:
            break
    }
}

export function curriculasAccionBtnTable(
    this: CurriculasComponent,
    { accion, item }
) {
    console.log(accion)

    switch (accion) {
        case 'editar':
            this.dialogVisible.curricula = true

            this.forms.curriculas.reset()

            this.modal = {
                title: 'Editar Curricula',
                type: 'curricula',
            }

            console.log('item')
            console.log(item)

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
                dtCurrRsl: item.dtCurrRsl,
                cCurrDescripcion: item.cCurrDescripcion,
            })

            break

        default:
            break
    }
}

export function curriculasSave(this: CurriculasComponent) {
    const formCurricula = this.forms.curriculas.value

    const payload: payload = {
        iModalServId: formCurricula.iModalServId,
        iCurrNotaMinima: formCurricula.iCurrNotaMinima,
        iCurrTotalCreditos: formCurricula.iCurrTotalCreditos,
        iCurrNroHoras: formCurricula.iCurrNroHoras,
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

export const editar = {
    labelTooltip: 'Editar',
    icon: 'pi pi-pencil',
    accion: 'editar',
    type: 'item',
    class: 'p-button-rounded p-button-warning p-button-text',
}
