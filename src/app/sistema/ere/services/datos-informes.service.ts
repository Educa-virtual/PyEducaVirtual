import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { map, of } from 'rxjs'

const baseUrl = environment.backendApi

@Injectable({
    providedIn: 'root',
})
export class DatosInformesService {
    constructor(
        private http: HttpClient,
        private store: LocalStoreService
    ) {}

    perfil = this.store.getItem('dremoPerfil')
    iYAcadId = this.store.getItem('dremoiYAcadId')

    lista: any[] = []

    parametros: any

    evaluaciones: Array<object>
    areas: Array<object>
    nivel_tipos: Array<object>
    nivel_grados: Array<object>
    distritos: Array<object>
    instituciones_educativas: Array<object>
    sexos: Array<object>
    secciones: Array<object>
    ugeles: Array<object>
    zonas: Array<object>
    tipo_sectores: Array<object>

    getSexos() {
        if (!this.sexos) {
            this.sexos = [
                { label: 'MASCULINO', value: 'M' },
                { label: 'FEMENINO', value: 'F' },
            ]
        }
        return this.sexos
    }

    obtenerParametros(data: any) {
        if (!this.parametros) {
            return this.http
                .post(
                    `${baseUrl}/ere/reportes/obtenerEvaluacionesCursosIes`,
                    data
                )
                .pipe(
                    map((data: any) => {
                        this.parametros = data.data[0]
                        return this.parametros
                    })
                )
        }
        return of(this.parametros)
    }

    getEvaluaciones(data: any) {
        if (!this.evaluaciones && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            this.evaluaciones = items.map((evaluacion) => ({
                value: evaluacion.iEvaluacionId,
                label: evaluacion.cEvaluacionNombre,
            }))
            return this.evaluaciones
        }
        return this.evaluaciones
    }

    getDistritos(data: any) {
        if (!this.distritos && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            this.distritos = items.map((distrito) => ({
                value: distrito.iDsttId,
                label: distrito.cDsttNombre,
            }))
            return this.distritos
        }
        return this.distritos
    }

    getNivelesTipos(data: any) {
        if (!this.nivel_tipos && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            this.nivel_tipos = items.map((nivel) => ({
                value: nivel.iNivelTipoId,
                label: nivel.cNivelTipoNombre,
                iEvaluacionId: nivel.iEvaluacionId,
            }))
            return this.nivel_tipos
        }
        return this.nivel_tipos
    }

    filterNivelesTipos(iEvaluacionId: any) {
        if (!iEvaluacionId) return null
        return this.nivel_tipos.filter((nivel_tipo: any) => {
            if (nivel_tipo.iEvaluacionId === iEvaluacionId) {
                return nivel_tipo
            }
            return null
        })
    }

    getNivelesGrados(data: any) {
        if (!this.nivel_grados && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            this.nivel_grados = items.map((nivel) => ({
                value: nivel.iNivelGradoId,
                label: nivel.cGradoNombre,
                iNivelTipoId: nivel.iNivelTipoId,
            }))
            return this.nivel_grados
        }
        return this.nivel_grados
    }

    filterNivelesGrados(iNivelTipoId: any) {
        if (!iNivelTipoId) return null
        return this.nivel_grados.filter((nivel_grado: any) => {
            if (nivel_grado.iNivelTipoId === iNivelTipoId) {
                return nivel_grado
            }
            return null
        })
    }

    getAreas(data: any) {
        if (!this.areas && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            this.areas = items.map((area) => ({
                value: area.iCursoId,
                label: area.cCursoNombre,
                iNivelTipoId: area.iNivelTipoId,
            }))
            return this.areas
        }
        return this.areas
    }

    filterAreas(iNivelTipoId: any) {
        if (!iNivelTipoId) return null
        return this.areas.filter((area: any) => {
            if (area.iNivelTipoId === iNivelTipoId) {
                return area
            }
            return null
        })
    }

    getSecciones(data: any) {
        if (!this.secciones && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            this.secciones = items.map((seccion) => ({
                value: seccion.iSeccionId,
                label: seccion.cSeccionNombre,
            }))
            return this.secciones
        }
        return this.secciones
    }

    getZonas(data: any) {
        if (!this.zonas && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            this.zonas = items.map((zona) => ({
                value: zona.iZonaId,
                label: zona.cZonaNombre,
            }))
            return this.zonas
        }
        return this.zonas
    }

    getTipoSectores(data: any) {
        if (!this.tipo_sectores && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            this.tipo_sectores = items.map((tipo_sector) => ({
                value: tipo_sector.iTipoSectorId,
                label: tipo_sector.cTipoSectorNombre,
            }))
            return this.tipo_sectores
        }
        return this.tipo_sectores
    }

    getUgeles(data: any) {
        if (!this.ugeles && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            this.ugeles = items.map((ugel) => ({
                value: ugel.iUgelId,
                label: ugel.cUgelNombre,
            }))
            return this.ugeles
        }
        return this.ugeles
    }

    getInstitucionesEducativas(data: any) {
        if (!this.instituciones_educativas && data) {
            const items = JSON.parse(data.replace(/^"(.*)"$/, '$1'))
            this.instituciones_educativas = items.map((ie) => ({
                value: ie.iIieeId,
                label: ie.cIieeNombre,
                iDsttId: ie?.iDsttId,
                iNivelTipoId: ie?.iNivelTipoId,
                iZonaId: ie?.iZonaId,
                iTipoSectorId: ie?.iTipoSectorId,
                iUgelId: ie?.iUgelId,
                evaluaciones: ie?.evaluaciones,
            }))
            return this.instituciones_educativas
        }
        return this.instituciones_educativas
    }

    filterInstitucionesEducativas(
        iEvaluacionId: any,
        iNivelTipoId: any,
        iDsttId: any,
        iZonaId: any,
        iTipoSectorId: any,
        iUgelId: any
    ) {
        console.log(
            iEvaluacionId,
            iNivelTipoId,
            iDsttId,
            'filterInstitucionesEducativas'
        )
        let ies_tmp: Array<object> = this.instituciones_educativas
        if (!iEvaluacionId && !iNivelTipoId) {
            return null
        }
        if (iEvaluacionId) {
            ies_tmp = ies_tmp.filter((ie: any) => {
                if (!ie.evaluaciones) return null
                const esta_en_evaluacion = ie.evaluaciones.filter(
                    (evaluacion: any) => {
                        if (evaluacion.iEvaluacionId == iEvaluacionId) {
                            return evaluacion
                        }
                        return null
                    }
                )
                if (esta_en_evaluacion.length > 0) {
                    return ie
                }
            })
        }
        if (iNivelTipoId) {
            console.log(ies_tmp, 'ies_tmp')
            ies_tmp = ies_tmp.filter((ie: any) => {
                if (ie.iNivelTipoId == iNivelTipoId) {
                    return ie
                }
                return null
            })
        }
        if (iDsttId) {
            ies_tmp = ies_tmp.filter((ie: any) => {
                if (ie.iDsttId == iDsttId) {
                    return ie
                }
                return null
            })
        }
        if (iZonaId) {
            ies_tmp = ies_tmp.filter((ie: any) => {
                if (ie.iZonaId == iZonaId) {
                    return ie
                }
                return null
            })
        }
        if (iTipoSectorId) {
            ies_tmp = ies_tmp.filter((ie: any) => {
                if (ie.iTipoSectorId == iTipoSectorId) {
                    return ie
                }
                return null
            })
        }
        if (iUgelId) {
            ies_tmp = ies_tmp.filter((ie: any) => {
                if (ie.iUgelId == iUgelId) {
                    return ie
                }
                return null
            })
        }
        return ies_tmp
    }

    obtenerInformeResumen(data: any) {
        return this.http.post(
            `${baseUrl}/ere/reportes/obtenerInformeResumen`,
            data
        )
    }

    exportarPdf(data: any) {
        return this.http.post(`${baseUrl}/ere/reportes/generarPdf`, data, {
            responseType: 'blob',
        })
    }

    exportarExcel(data: any) {
        return this.http.post(`${baseUrl}/ere/reportes/generarExcel`, data, {
            responseType: 'blob',
        })
    }

    importarResultados(data: any) {
        return this.http.post(
            `${baseUrl}/ere/reportes/importarResultados`,
            data
        )
    }
}
