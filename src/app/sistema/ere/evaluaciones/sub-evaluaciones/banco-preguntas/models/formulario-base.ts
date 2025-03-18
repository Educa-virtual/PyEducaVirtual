import { FormBuilder } from '@angular/forms'
import { sinEncabezadoObj } from '../components/banco-pregunta-encabezado-form/banco-pregunta-encabezado-form.component'
import { generarIdAleatorio } from '@/app/shared/utils/random-id'

export function crearFormularioBaseEncabezado(fb: FormBuilder) {
    return fb.group({
        iEncabPregId: [-1],
        cEncabPregTitulo: [''],
        encabezadoSelected: [sinEncabezadoObj],
        cEncabPregContenido: [''],
    })
}

export function crearFormularioBaseInformacionPregunta(
    fb: FormBuilder,
    withoutAditional = true
) {
    const baseForm = fb.group({
        iPreguntaId: [generarIdAleatorio()],
        iTipoPregId: [null],
        cPregunta: [null],
        cPreguntaTextoAyuda: [''],
        iPreguntaPeso: [null],
        isLocal: [true],
        isDeleted: [false],
        iHoras: [0],
        iMinutos: [0],
        iSegundos: [0],
        iPreguntaNivel: [null],
    })

    if (withoutAditional) {
        baseForm.removeControl('iPreguntaNivel')
    }
    return baseForm
}
