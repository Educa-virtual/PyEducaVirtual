interface InventoryStatus {
    label: string
    value: string
}
export interface Product {
    iIieeId?: any
    id?: string
    code?: string
    name?: string
    description?: string
    price?: number
    quantity?: number
    inventoryStatus?: InventoryStatus
    category?: string
    image?: string
    rating?: number
}
// export interface filtrougelnivel {
//     cIieeNombre: string // Nombre de la institución educativa
//     cIieeCodigoModular: string // Código modular
//     cNivelTipoNombre: string // Nombre del nivel
//     cUgelNombre: string // Nombre del Ugel
//     // Otras propiedades que necesites
// }
