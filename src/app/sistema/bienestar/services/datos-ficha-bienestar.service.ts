import { Injectable, OnDestroy } from '@angular/core'
import { GeneralService } from '@/app/servicios/general.service'
import { Subject } from 'rxjs'
import { map } from 'rxjs/operators'
import { of } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '@/environments/environment'
import { FichaGeneral } from '../interfaces/fichaGeneral'
import { FichaFamiliar } from '../interfaces/fichaFamiliar'
import { FichaVivienda } from '../interfaces/fichaVivienda'
import { FichaEconomico } from '../interfaces/FichaEconomico'
import { FichaAlimentacion } from '../interfaces/FichaAlimentacion'
import { FichaRecreacion } from '../interfaces/fichaRecreacion'
import { FichaSalud } from '../interfaces/FichaSalud'
import { FichaDiscapacidad } from '../interfaces/FichaDiscapacidad'

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

    /* ficha economico */
    rangos_sueldo: Array<object>
    dependencias_economicas: Array<object>
    tipos_apoyo_economico: Array<object>
    jornadas_trabajo: Array<object>

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

    /* ficha alimentacion */
    lugares_alimentacion: Array<object>
    programas_alimentarios: Array<object>

    /* ficha discapacidad */
    discapacidades: Array<object>

    /* ficha salud */
    dolencias: Array<object>
    pandemias: Array<object>
    seguros_salud: Array<object>

    /* ficha recreacion */
    deportes: Array<object>
    transportes: Array<object>
    pasatiempos: Array<object>
    actividades: Array<object>
    estados_relacion: Array<object>

    formGeneral: FichaGeneral
    formFamiliar: FichaFamiliar
    formVivienda: FichaVivienda
    formEconomico: FichaEconomico
    formAlimentacion: FichaAlimentacion
    formRecreacion: FichaRecreacion
    formSalud: FichaSalud
    formDiscapacidad: FichaDiscapacidad

    listarFichas(data: any) {
        return this.http.post(`${baseUrl}/bienestar/listarFichas`, data)
    }

    listarEstudiantesApoderado(data: any) {
        return this.http.post(
            `${baseUrl}/bienestar/listarEstudiantesApoderado`,
            data
        )
    }

    crearFicha(data: any) {
        return this.http.post(`${baseUrl}/bienestar/crearFicha`, data)
    }

    cancelarDeclaracion(data: any) {
        return this.http.post(`${baseUrl}/bienestar/cancelarDeclaracion`, data)
    }

    verFicha(data: any) {
        return this.http.post(`${baseUrl}/bienestar/verFicha`, data)
    }

    borrarFicha(data: any) {
        return this.http.post(`${baseUrl}/bienestar/borrarFicha`, data)
    }

    verFichaGeneral(data: any) {
        return this.http.post(`${baseUrl}/bienestar/verFichaGeneral`, data)
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

    verFichaEconomico(data: any) {
        return this.http.post(`${baseUrl}/bienestar/verFichaEconomico`, data)
    }

    guardarFichaEconomico(data: any) {
        return this.http.post(
            `${baseUrl}/bienestar/guardarFichaEconomico`,
            data
        )
    }

    actualizarFichaEconomico(data: any) {
        return this.http.post(
            `${baseUrl}/bienestar/actualizarFichaEconomico`,
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

    verFamiliar(data: any) {
        return this.http.post(`${baseUrl}/bienestar/verFichaFamiliar`, data)
    }

    listarFamiliares(data: any) {
        return this.http.post(
            `${baseUrl}/bienestar/listarFichaFamiliares`,
            data
        )
    }

    validarPersona(data: any) {
        return this.http.post(`${baseUrl}/grl/validarPersona`, data)
    }

    verFichaVivienda(data: any) {
        return this.http.post(`${baseUrl}/bienestar/verFichaVivienda`, data)
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

    verFichaAlimentacion(data: any) {
        return this.http.post(`${baseUrl}/bienestar/verFichaAlimentacion`, data)
    }

    guardarFichaAlimentacion(data: any) {
        return this.http.post(
            `${baseUrl}/bienestar/guardarFichaAlimentacion`,
            data
        )
    }

    actualizarFichaAlimentacion(data: any) {
        return this.http.post(
            `${baseUrl}/bienestar/actualizarFichaAlimentacion`,
            data
        )
    }

    verFichaRecreacion(data: any) {
        return this.http.post(`${baseUrl}/bienestar/verFichaRecreacion`, data)
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

    verFichaDiscapacidad(data: any) {
        return this.http.post(`${baseUrl}/bienestar/verFichaDiscapacidad`, data)
    }

    guardarFichaDiscapacidad(data: any) {
        return this.http.post(
            `${baseUrl}/bienestar/guardarFichaDiscapacidad`,
            data
        )
    }

    actualizarFichaDiscapacidad(data: any) {
        return this.http.post(
            `${baseUrl}/bienestar/actualizarFichaDiscapacidad`,
            data
        )
    }

    verFichaSalud(data: any) {
        return this.http.post(`${baseUrl}/bienestar/verFichaSalud`, data)
    }

    guardarFichaSalud(data: any) {
        return this.http.post(`${baseUrl}/bienestar/guardarFichaSalud`, data)
    }

    actualizarFichaSalud(data: any) {
        return this.http.post(`${baseUrl}/bienestar/actualizarFichaSalud`, data)
    }

    /**
     *
     * FUNCTIONES PARA POPULAR PARAMETROS DE FORMULARIOS DE FICHA
     *
     */

    /**
     * Función para obtener los parametros de la ficha
     */
    getFichaParametros() {
        if (!this.parametros) {
            return this.http
                .get(`${baseUrl}/bienestar/obtenerParametrosFicha`)
                .pipe(
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
                value: tipo_ie.iTipoIeEstId,
                label: tipo_ie.cTipoIeEstNombre,
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

    getEstadosRelacion() {
        return [
            { value: 1, label: 'Buena' },
            { value: 2, label: 'Regular' },
            { value: 3, label: 'Mala' },
        ]
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

    getProvincias(data: any) {
        if (!this.provincias && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            this.provincias = items.map((provincia) => ({
                value: provincia.iPrvnId,
                label: provincia.cPrvnNombre,
                iDptoId: provincia.iDptoId,
            }))
            return this.provincias
        }
        return this.provincias
    }

    filterProvincias(iDptoId: number) {
        if (!iDptoId) {
            return null
        }
        return this.provincias.filter((provincia: any) => {
            if (provincia.iDptoId === iDptoId) {
                return provincia
            }
            return null
        })
    }

    getDistritos(data: any) {
        if (!this.distritos && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            this.distritos = items.map((distrito) => ({
                value: distrito.iDsttId,
                label: distrito.cDsttNombre,
                iPrvnId: distrito.iPrvnId,
                ubigeo: distrito.cDsttCodigo,
                ubigeo_inei: distrito.cDsttCodigoINEI,
            }))
            return this.distritos
        }
        return this.distritos
    }

    filterDistritos(iPrvnId: number) {
        if (!iPrvnId) {
            return null
        }
        return this.distritos.filter((distrito: any) => {
            if (distrito.iPrvnId === iPrvnId) {
                return distrito
            }
            return null
        })
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

    getLugaresAlimentacion(data: any) {
        if (!this.lugares_alimentacion && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            return items.map((item: any) => ({
                value: item.iLugAlimId,
                label: item.cLugAlimDescripcion,
            }))
        }
        return this.lugares_alimentacion
    }

    getProgramasAlimentarios(data: any) {
        if (!this.programas_alimentarios && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            return items.map((item: any) => ({
                value: item.iProgAlimId,
                label: item.cProgAlimNombre,
            }))
        }
        return this.programas_alimentarios
    }

    getDiscapacidades(data: any) {
        if (!this.discapacidades && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            return items.map((item: any) => ({
                value: item.iDiscId,
                label: item.cDiscNombre,
            }))
        }
        return this.discapacidades
    }

    getDolencias(data: any) {
        if (!this.dolencias && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            return items.map((item: any) => ({
                value: item.iDolenciaId,
                label: item.cDolenciaNombre,
            }))
        }
        return this.dolencias
    }

    getSeguros(data: any) {
        if (!this.seguros_salud && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            return items.map((item: any) => ({
                value: item.iSegSaludId,
                label: item.cSegSaludNombre,
            }))
        }
        return this.seguros_salud
    }

    getDeportes(data: any) {
        if (!this.deportes && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            return items.map((item: any) => ({
                value: item.iDeporteId,
                label: item.cDeporteNombre,
            }))
        }
        return this.deportes
    }

    getTransportes(data: any) {
        if (!this.transportes && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            return items.map((item: any) => ({
                value: item.iTransporteId,
                label: item.cTransporteNombre,
            }))
        }
        return this.transportes
    }

    getPasatiempos(data: any) {
        if (!this.pasatiempos && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            return items.map((item: any) => ({
                value: item.iPasaTiempoId,
                label: item.cPasaTiempoNombre,
            }))
        }
        return this.pasatiempos
    }

    getActividades(data: any) {
        if (!this.actividades && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            return items.map((item: any) => ({
                value: item.iPasaTiempoId,
                label: item.cPasaTiempoNombre,
            }))
        }
        return this.actividades
    }

    getRangosSueldo(data: any) {
        if (!this.rangos_sueldo && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            return items.map((item: any) => ({
                value: item.iRangoSueldoId,
                label: item.cRangoSueldoDescripcion,
            }))
        }
        return this.rangos_sueldo
    }

    getDependenciasEconomicas(data: any) {
        if (!this.dependencias_economicas && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            return items.map((item: any) => ({
                value: item.iDepEcoId,
                label: item.cDepEcoDescripcion,
            }))
        }
        return this.dependencias_economicas
    }

    getTiposApoyoEconomico(data: any) {
        if (!this.tipos_apoyo_economico && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            return items.map((item: any) => ({
                value: item.iTipoAEcoId,
                label: item.cTipoAEcoDescripcion,
            }))
        }
        return this.tipos_apoyo_economico
    }

    getJornadasTrabajo(data: any) {
        if (!this.jornadas_trabajo && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            return items.map((item: any) => ({
                value: item.iJorTrabId,
                label: item.cJorTrabDescripcion,
            }))
        }
        return this.jornadas_trabajo
    }

    getPandemias(data: any) {
        if (!this.pandemias && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            return items.map((item: any) => ({
                value: item.iPandemiaId,
                label: item.cPandemiaNombre,
            }))
        }
        return this.pandemias
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

    listarDosis(data: any) {
        return this.http.post(`${baseUrl}/bienestar/listarDosis`, data)
    }

    verDosis(data: any) {
        return this.http.post(`${baseUrl}/bienestar/verDosis`, data)
    }

    guardarDosis(data: any) {
        return this.http.post(`${baseUrl}/bienestar/guardarDosis`, data)
    }

    actualizarDosis(data: any) {
        return this.http.post(`${baseUrl}/bienestar/actualizarDosis`, data)
    }

    borrarDosis(data: any) {
        return this.http.post(`${baseUrl}/bienestar/borrarDosis`, data)
    }

    descargarFicha(data: any) {
        return this.http.post(`${baseUrl}/bienestar/descargarFicha`, data, {
            responseType: 'blob',
        })
    }

    ngOnDestroy() {
        this.onDestroy$.next(true)
        this.onDestroy$.complete()
    }
}
