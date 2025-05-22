import { FormGroup } from '@angular/forms'
import { iCursos } from './cursos'

export interface FormConfig {
    curriculas: FormGroup
    cursos: FormGroup
    tipoCurso: FormGroup
    cursosNivelesGrados: FormGroup
}

export interface FormPatch {
    cursos: iCursos['patchValues']
}
