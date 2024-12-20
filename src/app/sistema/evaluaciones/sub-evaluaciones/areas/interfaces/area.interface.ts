export interface IArea {
    //id: number
    id: string | number // Acepta ambos tipos
    nombre: string
    descripcion: string
    seccion?: string
    grado?: string
    totalEstudiantes: number
    nivel: string
    cantidad?: number
}
