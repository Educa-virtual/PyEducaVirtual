import { Injectable, OnDestroy } from '@angular/core'
import { GeneralService } from '@/app/servicios/general.service'
import { Observable, Subject } from 'rxjs'
import { map, takeUntil } from 'rxjs/operators'
import { of } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '@/environments/environment.template'

const baseUrl = environment.backendApi

@Injectable({
    providedIn: 'root',
})
export class DatosFichaBienestarService implements OnDestroy {
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
    pandemias: Array<object>
    tipos_vias: Array<object>
    ocupaciones: Array<object>
    grados_instruccion: Array<object>
    tipos_ies: Array<object>

    guardarFamiliar(data: any) {
        return this.http.post(`${baseUrl}/obe/ficha/familia/save`, data)
    }

    actualizarFamiliar(data: any) {
        return this.http.post(`${baseUrl}/obe/ficha/familiar/update`, data)
    }

    borrarFamiliar(data: any) {
        return this.http.post(`${baseUrl}/obe/ficha/familiar/delete`, data)
    }

    searchFamiliares(data: any) {
        return this.http.post(`${baseUrl}/obe/searchFichaFamiliares`, data)
    }

    validarPersona(data: any) {
        return this.http.post(`${baseUrl}/grl/validarPersona`, data)
    }

    getTiposVias() {
        if (!this.tipos_vias) {
            return this.query
                .searchTablaXwhere({
                    esquema: 'obe',
                    tabla: 'tipos_vias',
                    campos: '*',
                    condicion: '1 = 1',
                })
                .pipe(
                    takeUntil(this.onDestroy$),
                    map((data: any) => {
                        const items = data.data
                        this.tipos_vias = items.map((tipo_via) => ({
                            value: tipo_via.iTipoViaId,
                            label: tipo_via.cTipoViaNombre,
                        }))
                        return this.tipos_vias
                    })
                )
        }
        return of(this.tipos_vias)
    }

    getOcupaciones() {
        if (!this.ocupaciones) {
            return this.query
                .searchTablaXwhere({
                    esquema: 'obe',
                    tabla: 'ocupaciones',
                    campos: '*',
                    condicion: '1 = 1',
                })
                .pipe(
                    takeUntil(this.onDestroy$),
                    map((data: any) => {
                        const items = data.data
                        this.ocupaciones = items.map((ocupacion) => ({
                            value: ocupacion.iOcupacionId,
                            label: ocupacion.cOcupacionNombre,
                        }))
                        return this.ocupaciones
                    })
                )
        }
        return of(this.ocupaciones)
    }

    getGradosInstruccion() {
        if (!this.grados_instruccion) {
            return this.query
                .searchTablaXwhere({
                    esquema: 'obe',
                    tabla: 'grados_instruccion',
                    campos: '*',
                    condicion: '1 = 1',
                })
                .pipe(
                    takeUntil(this.onDestroy$),
                    map((data: any) => {
                        const items = data.data
                        this.grados_instruccion = items.map(
                            (grado_instruccion) => ({
                                value: grado_instruccion.iGradoInstId,
                                label: grado_instruccion.cGradoInstNombre,
                            })
                        )
                        return this.grados_instruccion
                    })
                )
        }
        return of(this.grados_instruccion)
    }

    getTiposIes() {
        if (!this.tipos_ies) {
            return this.query
                .searchTablaXwhere({
                    esquema: 'obe',
                    tabla: 'tiopos_ies_estudio',
                    campos: '*',
                    condicion: '1 = 1',
                })
                .pipe(
                    takeUntil(this.onDestroy$),
                    map((data: any) => {
                        const items = data.data
                        this.tipos_ies = items.map((tipo_ie) => ({
                            value: tipo_ie.iNivelEstudiosId,
                            label: tipo_ie.cNivelEstudiosNombre,
                        }))
                        return this.tipos_ies
                    })
                )
        }
        return of(this.tipos_ies)
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
                            value: documento.iTipoFamiliarId,
                            label: documento.cTipoFamiliarDescripcion,
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
                            value: nacionalidad.iNacionId,
                            label: nacionalidad.cNacionNombre,
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
                            value: documento.iTipoIdentId,
                            label:
                                documento.cTipoIdentSigla +
                                ' - ' +
                                documento.cTipoIdentNombre,
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
                            value: estado_civil.iTipoEstCivId,
                            label: estado_civil.cTipoEstCivilNombre,
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
                { label: 'MASCULINO', value: 'M' },
                { label: 'FEMENINO', value: 'F' },
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
                                value: departamento.iDptoId,
                                label: departamento.cDptoNombre,
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
                        value: provincia.iPrvnId,
                        label: provincia.cPrvnNombre,
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
                        value: distrito.iDsttId,
                        label: distrito.cDsttNombre,
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
                { label: 'ESPAÑOL', value: '1' },
                { label: 'QUECHUA', value: '2' },
                { label: 'AYMARA', value: '3' },
                { label: 'INGLÉS', value: '4' },
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
                            value: tipo_contacto.iTipoConId,
                            label: tipo_contacto.cTipoConNombre,
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
                            value: religion.iReligionId,
                            label: religion.cReligionNombre,
                        }))
                        return this.religiones
                    })
                )
        }
        return of(this.religiones)
    }

    getPandemias() {
        if (!this.pandemias) {
            return this.query
                .searchTablaXwhere({
                    esquema: 'obe',
                    tabla: 'pandemias',
                    campos: '*',
                    condicion: '1 = 1',
                })
                .pipe(
                    takeUntil(this.onDestroy$),
                    map((data: any) => {
                        const items = data.data
                        this.pandemias = items.map((religion) => ({
                            value: religion.iPandemiaId,
                            label: religion.cPandemiaNombre,
                        }))
                        return this.pandemias
                    })
                )
        }
        return of(this.pandemias)
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

    searchDosis(data: any) {
        return this.http.post(`${baseUrl}/obe/dosis/index`, data)
    }

    agregarDosis(data: any) {
        return this.http.post(`${baseUrl}/obe/dosis/save`, data)
    }

    borrarDosis(data: any) {
        return this.http.post(`${baseUrl}/obe/dosis/delete`, data)
    }

    ngOnDestroy() {
        this.onDestroy$.next(true)
        this.onDestroy$.complete()
    }
}
