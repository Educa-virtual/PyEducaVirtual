import { Injectable, OnDestroy } from '@angular/core'
import { GeneralService } from '@/app/servicios/general.service'
import { Observable, Subject } from 'rxjs'
import { map, takeUntil } from 'rxjs/operators'
import { of } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '@/environments/environment'

const baseUrl = environment.backendApi

@Injectable({
    providedIn: 'root',
})
export class DatosEstudianteService implements OnDestroy {
    private onDestroy$ = new Subject<boolean>()

    constructor(
        private query: GeneralService,
        private http: HttpClient
    ) {}

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
    religiones: Array<object>

    guardarEstudiante(data: any) {
        return this.http.post(
            `${baseUrl}/acad/estudiante/guardarEstudiante`,
            data
        )
    }

    actualizarEstudiante(data: any) {
        return this.http.post(
            `${baseUrl}/acad/estudiante/actualizarEstudiante`,
            data
        )
    }

    guardarPersonaFamiliar(data: any) {
        return this.http.post(`${baseUrl}/grl/guardarPersonaFamiliar`, data)
    }

    actualizarPersonaFamiliar(data: any) {
        return this.http.post(`${baseUrl}/grl/actualizarPersonaFamiliar`, data)
    }

    borrarPersonaFamiliar(data: any) {
        return this.http.post(`${baseUrl}/grl/borrarPersonaFamiliar`, data)
    }

    searchEstudiante(data: any) {
        return this.http.post(
            `${baseUrl}/acad/estudiante/searchEstudiante`,
            data
        )
    }

    searchEstudiantes(data: any) {
        return this.http.post(
            `${baseUrl}/acad/estudiante/searchEstudiantes`,
            data
        )
    }

    searchApoderado(data: any) {
        return this.http.post(
            `${baseUrl}/acad/estudiante/searchApoderado`,
            data
        )
    }

    guardarApoderado(data: any) {
        return this.http.post(
            `${baseUrl}/acad/estudiante/guardarApoderado`,
            data
        )
    }

    actualizarApoderado(data: any) {
        return this.http.post(
            `${baseUrl}/acad/estudiante/actualizarApoderado`,
            data
        )
    }

    validarApoderado(data: any) {
        return this.http.post(
            `${baseUrl}/acad/estudiante/validarApoderado`,
            data
        )
    }

    searchEstudianteFamiliares(data: any) {
        return this.http.post(
            `${baseUrl}/acad/estudiante/searchFamiliares`,
            data
        )
    }

    searchEstudianteFamiliar(data: any) {
        return this.http.post(`${baseUrl}/acad/estudiante/searchFamiliar`, data)
    }

    validarEstudiante(data: any) {
        return this.http.post(
            `${baseUrl}/acad/estudiante/validarEstudiante`,
            data
        )
    }

    validarPersona(data: any) {
        return this.http.post(`${baseUrl}/grl/validarPersona`, data)
    }

    getTiposFamiliares() {
        if (!this.tipos_familiares) {
            return this.query
                .searchTablaXwhere({
                    esquema: 'obe',
                    tabla: 'tipo_familiares',
                    campos: '*',
                    condicion: '1 = 1',
                })
                .pipe(
                    takeUntil(this.onDestroy$),
                    map((data: any) => {
                        const items = data.data
                        this.tipos_familiares = items.map((documento) => ({
                            id: documento.iTipoFamiliarId,
                            nombre: documento.cTipoFamiliarDescripcion,
                        }))
                        return this.tipos_familiares
                    })
                )
        }
        return of(this.tipos_familiares)
    }

    getNacionalidades() {
        if (!this.nacionalidades) {
            return this.query
                .searchTablaXwhere({
                    esquema: 'grl',
                    tabla: 'nacionalidades',
                    campos: '*',
                    condicion: '1 = 1',
                })
                .pipe(
                    takeUntil(this.onDestroy$),
                    map((data: any) => {
                        const items = data.data
                        this.nacionalidades = items.map((nacionalidad) => ({
                            id: nacionalidad.iNacionId,
                            nombre: nacionalidad.cNacionNombre,
                        }))
                        return this.nacionalidades
                    })
                )
        }
        return of(this.nacionalidades)
    }

    getTiposDocumentos() {
        if (!this.tipos_documentos) {
            return this.query
                .searchTablaXwhere({
                    esquema: 'grl',
                    tabla: 'tipos_Identificaciones',
                    campos: '*',
                    condicion: '1 = 1',
                })
                .pipe(
                    takeUntil(this.onDestroy$),
                    map((data: any) => {
                        const items = data.data
                        this.tipos_documentos = items.map((documento) => ({
                            id: documento.iTipoIdentId,
                            nombre: documento.cTipoIdentNombre,
                            longitud: documento.iTipoIdentLongitud,
                        }))
                        return this.tipos_documentos
                    })
                )
        }
        return of(this.tipos_documentos)
    }

    getEstadosCiviles() {
        if (!this.estados_civiles) {
            return this.query
                .searchTablaXwhere({
                    esquema: 'grl',
                    tabla: 'tipos_estados_civiles',
                    campos: '*',
                    condicion: '1 = 1',
                })
                .pipe(
                    takeUntil(this.onDestroy$),
                    map((data: any) => {
                        const items = data.data
                        this.estados_civiles = items.map((estado_civil) => ({
                            id: estado_civil.iTipoEstCivId,
                            nombre: estado_civil.cTipoEstCivilNombre,
                        }))
                        return this.estados_civiles
                    })
                )
        }
        return of(this.estados_civiles)
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

    getDepartamentos(): Observable<Array<object>> {
        if (!this.departamentos) {
            return this.query
                .searchTablaXwhere({
                    esquema: 'grl',
                    tabla: 'departamentos',
                    campos: '*',
                    condicion: '1 = 1',
                })
                .pipe(
                    takeUntil(this.onDestroy$),
                    map((data: any) => {
                        const departamentos = data.data
                        this.departamentos = departamentos.map(
                            (departamento) => ({
                                id: departamento.iDptoId,
                                nombre: departamento.cDptoNombre,
                            })
                        )
                        return this.departamentos
                    })
                )
        }
        return of(this.departamentos)
    }

    getProvincias(iDptoId: number): Observable<Array<object>> {
        if (!iDptoId) {
            return null
        }
        return this.query
            .searchTablaXwhere({
                esquema: 'grl',
                tabla: 'provincias',
                campos: '*',
                condicion: 'iDptoId = ' + iDptoId,
            })
            .pipe(
                takeUntil(this.onDestroy$),
                map((data: any) => {
                    const items = data.data
                    this.distritos = items.map((provincia) => ({
                        id: provincia.iPrvnId,
                        nombre: provincia.cPrvnNombre,
                    }))
                    return this.distritos
                })
            )
    }

    getDistritos(iPrvnId: number) {
        if (!iPrvnId) {
            return null
        }
        return this.query
            .searchTablaXwhere({
                esquema: 'grl',
                tabla: 'distritos',
                campos: '*',
                condicion: 'iPrvnId = ' + iPrvnId,
            })
            .pipe(
                takeUntil(this.onDestroy$),
                map((data: any) => {
                    const items = data.data
                    this.distritos = items.map((distrito) => ({
                        id: distrito.iDsttId,
                        nombre: distrito.cDsttNombre,
                        ubigeo: distrito.cDsttCodigo,
                        ubigeo_inei: distrito.cDsttCodigoINEI,
                    }))
                    return this.distritos
                })
            )
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
            return this.query
                .searchTablaXwhere({
                    esquema: 'grl',
                    tabla: 'tipos_contactos',
                    campos: '*',
                    condicion: '1 = 1',
                })
                .pipe(
                    takeUntil(this.onDestroy$),
                    map((data: any) => {
                        const items = data.data
                        this.tipos_contacto = items.map((tipo_contacto) => ({
                            id: tipo_contacto.iTipoConId,
                            nombre: tipo_contacto.cTipoConNombre,
                        }))
                        return this.tipos_contacto
                    })
                )
        }
        return of(this.tipos_contacto)
    }

    getReligiones() {
        if (!this.religiones) {
            return this.query
                .searchTablaXwhere({
                    esquema: 'obe',
                    tabla: 'religiones',
                    campos: '*',
                    condicion: '1 = 1',
                })
                .pipe(
                    takeUntil(this.onDestroy$),
                    map((data: any) => {
                        const items = data.data
                        this.religiones = items.map((religion) => ({
                            id: religion.iReligionId,
                            nombre: religion.cReligionNombre,
                        }))
                        return this.religiones
                    })
                )
        }
        return of(this.religiones)
    }

    subirArchivo(data: any) {
        return this.http.post(
            `${baseUrl}/acad/estudiante/importarEstudiantesPadresExcel`,
            data,
            {
                headers: new HttpHeaders({
                    Accept: 'application/json',
                }),
            }
        )
    }

    ngOnDestroy() {
        this.onDestroy$.next(true)
        this.onDestroy$.complete()
    }
}
