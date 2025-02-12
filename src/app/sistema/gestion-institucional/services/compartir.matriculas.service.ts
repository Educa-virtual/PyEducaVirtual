import { Injectable } from '@angular/core'
import { GeneralService } from '@/app/servicios/general.service'

//import { BehaviorSubject } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class CompartirMatriculasService {
    lista: any[] = []

    tipos_documentos: Array<object>
    tipos_familiares: Array<object>
    estados_civiles: Array<object>
    sexos: Array<object>
    nacionalidades: Array<object>
    departamentos: Array<object>
    provincias: Array<object>
    distritos: Array<object>
    lenguas: Array<object>
    tipos_contacto: Array<object>

    private activeIndex: string
    private iEstudianteId: string | null = null
    private iPersId: string | null = null
    private iPersRepresentanteLegalId: string | null = null

    clearData() {
        this.activeIndex = '0'
        this.iEstudianteId = null
        this.iPersId = null
        this.iPersRepresentanteLegalId = null
        localStorage.removeItem('activeIndex')
        localStorage.removeItem('iEstudianteId')
        localStorage.removeItem('iPersId')
        localStorage.removeItem('iPersRepresentanteLegalId')
    }

    setActiveIndex(index: string | null) {
        this.activeIndex = index
        localStorage.setItem('activeIndex', index)
    }

    getActiveIndex(): string | null {
        if (!this.activeIndex) {
            this.activeIndex =
                localStorage.getItem('activeIndex') == 'null'
                    ? null
                    : localStorage.getItem('activeIndex')
        }
        return this.activeIndex
    }

    setiEstudianteId(id: string | null) {
        this.iEstudianteId = id
        localStorage.setItem('iEstudianteId', id)
    }

    getiEstudianteId(): string | null {
        if (!this.iEstudianteId) {
            this.iEstudianteId =
                localStorage.getItem('iEstudianteId') == 'null'
                    ? null
                    : localStorage.getItem('iEstudianteId')
        }
        return this.iEstudianteId
    }

    setiPersId(id: string | null) {
        this.iPersId = id
        localStorage.setItem('iPersId', id)
    }

    getiPersId(): string | null {
        if (!this.iPersId) {
            this.iPersId =
                localStorage.getItem('iPersId') == 'null'
                    ? null
                    : localStorage.getItem('iPersId')
        }
        return this.iPersId
    }

    setiPersRepresentanteLegalId(id: string | null) {
        this.iPersRepresentanteLegalId = id
        localStorage.setItem('iPersRepresentanteLegalId', id)
    }

    getiPersRepresentanteLegalId(): string | null {
        if (!this.iPersRepresentanteLegalId) {
            this.iPersRepresentanteLegalId =
                localStorage.getItem('iPersRepresentanteLegalId') == 'null'
                    ? null
                    : localStorage.getItem('iPersRepresentanteLegalId')
        }
        return this.iPersRepresentanteLegalId
    }

    getTiposFamiliares() {
        if (!this.tipos_familiares) {
            this.query
                .searchTablaXwhere({
                    esquema: 'obe',
                    tabla: 'tipo_familiares',
                    campos: '*',
                    condicion: '1 = 1',
                })
                .subscribe({
                    next: (data: any) => {
                        const item = data.data
                        this.tipos_familiares = item.map((documento) => ({
                            id: documento.iTipoFamiliarId,
                            nombre: documento.cTipoFamiliarDescripcion,
                        }))
                        console.log(
                            this.tipos_familiares,
                            'tipos de familiares'
                        )
                    },
                    error: (error) => {
                        console.error(
                            'Error obteniendo tipos de familiares:',
                            error
                        )
                    },
                    complete: () => {
                        console.log('Request completed')
                    },
                })
        }
        return this.tipos_familiares
    }

    getNacionalidades() {
        if (!this.nacionalidades) {
            this.query
                .searchTablaXwhere({
                    esquema: 'grl',
                    tabla: 'nacionalidades',
                    campos: '*',
                    condicion: '1 = 1',
                })
                .subscribe({
                    next: (data: any) => {
                        const item = data.data
                        this.nacionalidades = item.map((nacionalidad) => ({
                            id: nacionalidad.iNacionId,
                            nombre: nacionalidad.cNacionNombre,
                        }))
                        console.log(this.nacionalidades, 'nacionalidades')
                    },
                    error: (error) => {
                        console.error('Error obteniendo nacionalidades:', error)
                    },
                    complete: () => {
                        console.log('Request completed')
                    },
                })
        }
        return this.nacionalidades
    }

    getTiposDocumentos() {
        if (!this.tipos_documentos) {
            this.query
                .searchTablaXwhere({
                    esquema: 'grl',
                    tabla: 'tipos_Identificaciones',
                    campos: '*',
                    condicion: '1 = 1',
                })
                .subscribe({
                    next: (data: any) => {
                        const item = data.data
                        this.tipos_documentos = item.map((documento) => ({
                            id: documento.iTipoIdentId,
                            nombre: documento.cTipoIdentNombre,
                        }))
                        console.log(
                            this.tipos_documentos,
                            'tipos de documentos'
                        )
                    },
                    error: (error) => {
                        console.error(
                            'Error obteniendo tipos de documentos:',
                            error
                        )
                    },
                    complete: () => {
                        console.log('Request completed')
                    },
                })
        }
        return this.tipos_documentos
    }

    getEstadosCiviles() {
        if (!this.estados_civiles) {
            this.query
                .searchTablaXwhere({
                    esquema: 'grl',
                    tabla: 'tipos_estados_civiles',
                    campos: '*',
                    condicion: '1 = 1',
                })
                .subscribe({
                    next: (data: any) => {
                        const item = data.data
                        this.estados_civiles = item.map((documento) => ({
                            id: documento.iTipoEstCivId,
                            nombre: documento.cTipoEstCivilNombre,
                        }))
                        console.log(this.estados_civiles, 'estados civiles')
                    },
                    error: (error) => {
                        console.error(
                            'Error obteniendo estados civiles:',
                            error
                        )
                    },
                    complete: () => {
                        console.log('Request completed')
                    },
                })
        }
        return this.estados_civiles
    }

    getSexos() {
        if (!this.sexos) {
            this.sexos = [
                { nombre: 'MASCULINO', id: 'M' },
                { nombre: 'FEMENINO', id: 'F' },
            ]
        }
        return this.sexos
    }

    getDepartamentos() {
        if (!this.departamentos) {
            this.query
                .searchTablaXwhere({
                    esquema: 'grl',
                    tabla: 'departamentos',
                    campos: '*',
                    condicion: '1 = 1',
                })
                .subscribe({
                    next: (data: any) => {
                        const item = data.data
                        this.departamentos = item.map((departamento) => ({
                            id: departamento.iDptoId,
                            nombre: departamento.cDptoNombre,
                        }))
                        console.log(this.departamentos, 'departamentos')
                    },
                    error: (error) => {
                        console.error('Error obteniendo departamentos:', error)
                    },
                    complete: () => {
                        console.log('Request completed')
                    },
                })
        }
        return this.departamentos
    }

    getProvincias(iDptoId: number) {
        if (!iDptoId) {
            return null
        }
        this.query
            .searchTablaXwhere({
                esquema: 'grl',
                tabla: 'provincias',
                campos: '*',
                condicion: 'iDptoId = ' + iDptoId,
            })
            .subscribe({
                next: (data: any) => {
                    const item = data.data
                    this.provincias = item.map((provincia) => ({
                        id: provincia.iPrvnId,
                        nombre: provincia.cPrvnNombre,
                    }))
                    console.log(this.provincias, 'provincias')
                },
                error: (error) => {
                    console.error('Error obteniendo provincias:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
        return this.provincias
    }

    getDistritos(iPrvnId: number) {
        if (!iPrvnId) {
            return null
        }
        this.query
            .searchTablaXwhere({
                esquema: 'grl',
                tabla: 'distritos',
                campos: '*',
                condicion: 'iPrvnId = ' + iPrvnId,
            })
            .subscribe({
                next: (data: any) => {
                    const item = data.data
                    this.distritos = item.map((distrito) => ({
                        id: distrito.iDsttId,
                        nombre: distrito.cDsttNombre,
                    }))
                    console.log(this.distritos, 'distritos')
                },
                error: (error) => {
                    console.error('Error obteniendo distritos:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
        return this.distritos
    }

    getLenguas() {
        if (!this.lenguas) {
            this.lenguas = [
                { nombre: 'ESPAÑOL', id: '1' },
                { nombre: 'QUECHUA', id: '2' },
                { nombre: 'AYMARA', id: '3' },
                { nombre: 'INGLÉS', id: '4' },
            ]
        }
        return this.lenguas
    }

    getTiposContacto() {
        if (!this.tipos_contacto) {
            this.query
                .searchTablaXwhere({
                    esquema: 'grl',
                    tabla: 'tipos_contactos',
                    campos: '*',
                    condicion: '1 = 1',
                })
                .subscribe({
                    next: (data: any) => {
                        const item = data.data
                        this.tipos_contacto = item.map((tipo_contacto) => ({
                            id: tipo_contacto.iTipoConId,
                            nombre: tipo_contacto.cTipoConNombre,
                        }))
                        console.log(this.tipos_contacto, 'tipos_contactos')
                    },
                    error: (error) => {
                        console.error(
                            'Error obteniendo tipos_contactos:',
                            error
                        )
                    },
                    complete: () => {
                        console.log('Request completed')
                    },
                })
        }
        return this.tipos_contacto
    }

    constructor(private query: GeneralService) {}
}
