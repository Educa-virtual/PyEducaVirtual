import { IPregunta } from './pregunta.model'

export interface iPreguntaAula extends IPregunta {
    iDocenteId: number
    iCurrContId: number
    iNivelCiloId: number
}
