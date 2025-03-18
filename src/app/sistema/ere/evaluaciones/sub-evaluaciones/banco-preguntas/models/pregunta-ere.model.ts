import { IPregunta } from './pregunta.model'

export interface IPreguntaEre extends IPregunta {
    iEspecialistaId: number
    iDesempenoId: number
    iNivelGradoId: number
    cPreguntaClave?: string
    iPreguntaNivel: number
}
