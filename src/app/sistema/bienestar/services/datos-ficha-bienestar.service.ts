import { Injectable, OnDestroy } from '@angular/core'
import { GeneralService } from '@/app/servicios/general.service'
import { Subject } from 'rxjs'
import { map, takeUntil } from 'rxjs/operators'
import { of } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '@/environments/environment.template'
import { FichaGeneral } from '../interfaces/fichaGeneral'
import { FichaFamiliar } from '../interfaces/fichaFamiliar'
import { FichaVivienda } from '../interfaces/fichaVivienda'

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

    parametros: any

    /* ficha general */
    tipos_vias: Array<object>
    religiones: Array<object>

    /* ficha familiar */
    tipos_familiares: Array<object>
    ocupaciones: Array<object>
    grados_instruccion: Array<object>
    tipos_ies: Array<object>
    tipos_documentos: Array<object>
    estados_civiles: Array<object>
    sexos: Array<object>
    nacionalidades: Array<object>
    departamentos: Array<object>
    provincias: Array<object>
    distritos: Array<object>
    lenguas: Array<object>

    /* ficha vivienda */
    ocupaciones_vivienda: Array<object>
    pisos_vivienda: Array<object>
    estados_vivienda: Array<object>
    materiales_paredes_vivienda: Array<object>
    materiales_pisos_vivienda: Array<object>
    materiales_techos_vivienda: Array<object>
    tipos_vivienda: Array<object>
    suministros_agua: Array<object>
    tipos_sshh: Array<object>
    tipos_alumbrado: Array<object>
    otros_elementos: Array<object>

    /* ficha salid */
    pandemias: Array<object>

    formGeneral: FichaGeneral
    formFamiliar: FichaFamiliar
    formVivienda: FichaVivienda

    searchFichas(data: any) {
        return this.http.post(`${baseUrl}/bienestar/searchFichas`, data)
    }

    searchFichaGeneral(data: any) {
        if (!this.formGeneral) {
            return this.http
                .post(`${baseUrl}/bienestar/searchFichaGeneral`, data)
                .pipe(
                    map((data: any) => {
                        this.formGeneral = data.data[0]
                        return this.formGeneral
                    })
                )
        }
        return of(this.formGeneral)
    }

    guardarFichaGeneral(data: any) {
        return this.http.post(`${baseUrl}/bienestar/guardarFichaGeneral`, data)
    }

    actualizarFichaGeneral(data: any) {
        return this.http.post(
            `${baseUrl}/bienestar/actualizarFichaGeneral`,
            data
        )
    }

    guardarFamiliar(data: any) {
        return this.http.post(`${baseUrl}/bienestar/guardarFichaFamiliar`, data)
    }

    actualizarFamiliar(data: any) {
        return this.http.post(
            `${baseUrl}/bienestar/actualizarFichaFamiliar`,
            data
        )
    }

    borrarFamiliar(data: any) {
        return this.http.post(`${baseUrl}/bienestar/borrarFichaFamiliar`, data)
    }

    searchFamiliares(data: any) {
        return this.http.post(
            `${baseUrl}/bienestar/searchFichaFamiliares`,
            data
        )
    }

    validarPersona(data: any) {
        return this.http.post(`${baseUrl}/grl/validarPersona`, data)
    }

    searchFichaVivienda(data: any) {
        return this.http.post(`${baseUrl}/bienestar/searchFichaVivienda`, data)
    }

    guardarFichaVivienda(data: any) {
        return this.http.post(`${baseUrl}/bienestar/guardarFichaVivienda`, data)
    }

    actualizarFichaVivienda(data: any) {
        return this.http.post(
            `${baseUrl}/bienestar/actualizarFichaVivienda`,
            data
        )
    }

    searchFichaRecreacion(data: any) {
        return this.http.post(
            `${baseUrl}/bienestar/searchFichaRecreacion`,
            data
        )
    }

    guardarFichaRecreacion(data: any) {
        return this.http.post(
            `${baseUrl}/bienestar/guardarFichaRecreacion`,
            data
        )
    }

    actualizarFichaRecreacion(data: any) {
        return this.http.post(
            `${baseUrl}/bienestar/actualizarFichaRecreacion`,
            data
        )
    }

    /*
     * Funciones para popular parametros de formularios de ficha
     */

    /**
     * Función para obtener los parametros de la ficha
     */
    getFichaParametros() {
        if (!this.parametros) {
            return this.http.get(`${baseUrl}/bienestar/createFicha`).pipe(
                map((data: any) => {
                    this.parametros = data.data[0]
                    return this.parametros
                })
            )
        }
        return of(this.parametros)
    }

    getTiposVias(data: any) {
        if (!this.tipos_vias && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            return items.map((tipo_via: any) => ({
                value: tipo_via.iTipoViaId,
                label: tipo_via.cTipoViaNombre,
            }))
        }
        return this.tipos_vias
    }

    getOcupaciones(data: any) {
        if (!this.ocupaciones && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            this.ocupaciones = items.map((ocupacion: any) => ({
                value: ocupacion.iOcupacionId,
                label: ocupacion.cOcupacionNombre,
            }))
            return this.ocupaciones
        }
        return this.ocupaciones
    }

    getGradosInstruccion(data: any) {
        if (!this.grados_instruccion && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            this.grados_instruccion = items.map((grado) => ({
                value: grado.iGradoInstId,
                label: grado.cGradoInstNombre,
            }))
            return this.grados_instruccion
        }
        return this.grados_instruccion
    }

    getTiposIes(data: any) {
        if (!this.tipos_ies && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            this.tipos_ies = items.map((tipo_ie) => ({
                value: tipo_ie.iNivelEstudiosId,
                label: tipo_ie.cNivelEstudiosNombre,
            }))
            return this.tipos_ies
        }
        return this.tipos_ies
    }

    getTiposFamiliares(data: any) {
        if (!this.tipos_familiares && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            this.tipos_familiares = items.map((documento) => ({
                value: documento.iTipoFamiliarId,
                label: documento.cTipoFamiliarDescripcion,
            }))
            return this.tipos_familiares
        }
        return this.tipos_familiares
    }

    getNacionalidades(data: any) {
        if (!this.nacionalidades && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            this.nacionalidades = items.map((nacionalidad) => ({
                value: nacionalidad.iNacionId,
                label: nacionalidad.cNacionNombre,
            }))
            return this.nacionalidades
        }
        return this.nacionalidades
    }

    getTiposDocumentos(data: any) {
        if (!this.tipos_documentos && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            this.tipos_documentos = items.map((documento) => ({
                value: documento.iTipoIdentId,
                label:
                    documento.cTipoIdentSigla +
                    ' - ' +
                    documento.cTipoIdentNombre,
                longitud: documento.iTipoIdentLongitud,
            }))
        }
        return this.tipos_documentos
    }

    getEstadosCiviles(data: any) {
        if (!this.estados_civiles && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            this.estados_civiles = items.map((estado_civil) => ({
                value: estado_civil.iTipoEstCivId,
                label: estado_civil.cTipoEstCivilNombre,
            }))
            return this.estados_civiles
        }
        return this.estados_civiles
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

    getDepartamentos(data: any) {
        if (!this.departamentos && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            this.departamentos = items.map((departamento) => ({
                value: departamento.iDptoId,
                label: departamento.cDptoNombre,
            }))
            return this.departamentos
        }
        return this.departamentos
    }

    getProvincias(iDptoId: number) {
        if (!iDptoId) {
            return null
        }
        return this.parametros.provincias.filter((provincia) => {
            return provincia.iDptoId === iDptoId ? provincia : null
        })
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

    getReligiones(data: any) {
        if (!this.religiones && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            return items.map((item: any) => ({
                value: item.iReligionId,
                label: item.cReligionNombre,
            }))
        }
        return this.religiones
    }

    getOcupacionesVivienda(data: any) {
        if (!this.ocupaciones_vivienda && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            return items.map((item: any) => ({
                value: item.iTipoOcupaVivId,
                label: item.cTipoOcupaVivDescripcion,
            }))
        }
        return this.ocupaciones_vivienda
    }

    getPisosVivienda(data: any) {
        if (!this.pisos_vivienda && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            return items.map((item: any) => ({
                value: item.iMatPisoVivId,
                label: item.cMatPisoVivDescripcion,
            }))
        }
        return this.pisos_vivienda
    }

    getEstadosVivienda(data: any) {
        if (!this.estados_vivienda && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            return items.map((item: any) => ({
                value: item.iEstadoVivId,
                label: item.cEstadoVivDescripcion,
            }))
        }
        return this.estados_vivienda
    }

    getTiposVivienda(data: any) {
        if (!this.tipos_vivienda && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            return items.map((item: any) => ({
                value: item.iTipoVivId,
                label: item.cTipoVivDescripcion,
            }))
        }
        return this.tipos_vivienda
    }

    getParedesVivienda(data: any) {
        if (!this.materiales_paredes_vivienda && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            return items.map((item: any) => ({
                value: item.iMatPreId,
                label: item.cMatPreDescripcion,
            }))
        }
        return this.materiales_paredes_vivienda
    }

    getTechosVivienda(data: any) {
        if (!this.materiales_techos_vivienda && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            return items.map((item: any) => ({
                value: item.iMatTecVivId,
                label: item.cMatTecVivDescripcion,
            }))
        }
        return this.materiales_techos_vivienda
    }

    getSuministrosAgua(data: any) {
        if (!this.suministros_agua && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            return items.map((item: any) => ({
                value: item.iTipoSumAId,
                label: item.cTipoSumADescripcion,
            }))
        }
        return this.suministros_agua
    }

    getTiposSshh(data: any) {
        if (!this.tipos_sshh && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            return items.map((item: any) => ({
                value: item.iTiposSsHhId,
                label: item.cTipoSsHhDescripcion,
            }))
        }
        return this.tipos_sshh
    }

    getTiposAlumbrado(data: any) {
        if (!this.tipos_alumbrado && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            return items.map((item: any) => ({
                value: item.iTipoAlumId,
                label: item.cTipoAlumDescripcion,
            }))
        }
        return this.tipos_alumbrado
    }

    getOtrosElementos(data: any) {
        if (!this.otros_elementos && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            return items.map((item: any) => ({
                value: item.iEleParaVivId,
                label: item.cEleParaVivDescripcion,
            }))
        }
        return this.otros_elementos
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
