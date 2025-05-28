interface EnlaceAyuda {
    title: string
    section: number
    description: string
    url: string
}

export interface secciones {
    title: string
    description: string
    perfiles: string[]
    section: EnlaceAyuda[]
}
