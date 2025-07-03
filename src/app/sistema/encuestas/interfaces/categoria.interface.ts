export interface ICategoria {
    iCategoriaEncuestaId: number
    bPuedeCrearDirector: boolean
    bPuedeCrearEspDremo: boolean
    bPuedeCrearEspUgel: boolean
    cDescripcion: string
    cImagenUrl?: string
    cNombre?: string
    iTotalEncuestas?: number
}
