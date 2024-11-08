import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { httpService } from '../../http/httpService'
import { tap, catchError } from 'rxjs/operators'
import { throwError, EMPTY, Observable } from 'rxjs'

export type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never

@Injectable()
export class TicketService {
    registroInformation: {
        mode?: 'create' | 'edit'
        modal?: 'create' | 'edit'

        calendar?: {
            iCalAcadId?: string
            iYAcadId: string
            iSedeId: string
        }

        stepYear?: {
            fechaVigente: string
            fechaInicio: Date
            fechaFin: Date
            matriculaInicio?: Date
            matriculaFin?: Date
            bCalAcadFaseRegular?: boolean
            bCalAcadFaseRecuperacion?: boolean
            fases_promocionales?: {
                iFaseId?: string
                iFasePromId?: string
                cFasePromNombre?: string
                dtFaseInicio?: Date
                dtFaseFin?: Date
            }[]
        }

        stepDiasLaborales?: {
            iDiaLabId?: string
            iDiaId: string
            iDia: string
            cDiaNombre: string
            cDiaAbreviado: string
        }[]
        stepFormasAtencion?: {
            iCalTurnoId?: string
            dtTurnoInicia?: Date
            dtTurnoFin?: Date
            iModalServId: string
            cModalServNombre: string
            iTurnoId: string
            cTurnoNombre: string
            dtAperTurnoInicio: Date
            dtAperTurnoFin: Date
        }[]
        stepPeriodosAcademicos?: {
            iPeriodoEvalAperId?: string
            iPeriodoEvalId: string
            cPeriodoEvalNombre: 'semestral' | 'trimestral' | 'bimestral'
            cPeriodoEvalLetra: string
            iPeriodoEvalCantidad: string
            ciclosAcademicos?: {
                PeriodType: string
                iPeriodoEvalId: string
                StartDate: Date
                EndDate: Date
            }[]
        }[]
    }

    private registrationComplete = new Subject<any>()

    registrationComplete$ = this.registrationComplete.asObservable()

    constructor(private httpService: httpService) {}

    getTicketInformation() {
        return this.registroInformation
    }

    setTicketInformation<K extends keyof typeof this.registroInformation>(
        registroInformation: (typeof this.registroInformation)[K],
        key: K
    ) {
        this.registroInformation[key] = registroInformation
    }

    complete() {
        this.registrationComplete.next(this.registroInformation.stepYear)
    }

    /**
     * @param {string} fecha
     * @param {string} typeFormat DD/MM/YY hh:mm:ss - use YYYY for full year
     * @returns {string}
     */
    toVisualFechasFormat(fecha, typeFormat = 'DD/MM/YY hh:mm') {
        const date = new Date(fecha)

        const replacements = {
            DD: String(date.getDate()).padStart(2, '0'),
            MM: String(date.getMonth() + 1).padStart(2, '0'),
            YY: String(date.getFullYear()).slice(-2),
            YYYY: date.getFullYear(),
            hh: String(date.getHours()).padStart(2, '0'),
            mm: String(date.getMinutes()).padStart(2, '0'),
            ss: String(date.getSeconds()).padStart(2, '0'),
        }

        // Reemplaza cada formato en el string de typeFormat usando el objeto replacements
        return typeFormat.replace(
            /DD|MM|YYYY|YY|hh|mm|ss/g,
            (match) => replacements[match]
        )
    }

    toSQLDatetimeFormat(fecha: Date) {
        const date = new Date(fecha)

        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        const formattedTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`

        return `${formattedDate} ${formattedTime}`
    }

    capitalize(text) {
        if (!text) return ''
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
    }

    convertToSQLDateTime(input) {
        // Verifica si el input contiene solo una hora o una fecha completa
        const timeOnlyPattern = /^\d{2}:\d{2}$/
        let dateObject

        if (timeOnlyPattern.test(input)) {
            // Si es solo hora, combínala con la fecha actual
            const currentDate = new Date().toISOString().slice(0, 10)
            dateObject = new Date(`${currentDate}T${input}:00`)
        } else {
            // Si es una fecha completa, intenta convertirla a Date
            dateObject = new Date(input)
        }

        // Formatea la fecha y hora al formato SQL 'YYYY-MM-DD HH:mm:ss'
        const year = dateObject.getFullYear()
        const month = String(dateObject.getMonth() + 1).padStart(2, '0')
        const day = String(dateObject.getDate()).padStart(2, '0')
        const hours = String(dateObject.getHours()).padStart(2, '0')
        const minutes = String(dateObject.getMinutes()).padStart(2, '0')
        const seconds = String(dateObject.getSeconds()).padStart(2, '0')

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }

    periodosDuracion = {
        bimestral: 60,
        trimestral: 90,
        semestral: 180,
    }

    calcularFechaPeriodos(inicio, fin, tipo) {
        // Verifica si el tipo es válido
        const periodos = []
        const fechaInicio = new Date(inicio)
        const fechaFin = new Date(fin)
        const duracion = this.periodosDuracion[tipo]

        // Calcular la fecha de cada periodo
        let contador = 1 // Contador para los períodos
        let key

        for (const [clave, valor] of Object.entries(this.periodosDuracion)) {
            if (tipo === 'trimestral') {
                key = 'trimestre' // Retorna la clave si el valor coincide
            }
            if (tipo === 'semestral') {
                key = 'semestre' // Retorna la clave si el valor coincide
            }
            if (tipo === 'bimestral') {
                key = 'bimestre' // Retorna la clave si el valor coincide
            }
        }

        while (fechaInicio < fechaFin) {
            // Clonar fecha de inicio para calcular la fecha de fin del período
            const fechaFinPeriodo = new Date(fechaInicio.getTime())
            fechaFinPeriodo.setDate(fechaFinPeriodo.getDate() + duracion)

            // Añadir el período al array
            periodos.push({
                fechaInicio: new Date(fechaInicio),
                fechaFin:
                    fechaFinPeriodo > fechaFin
                        ? new Date(fechaFin)
                        : fechaFinPeriodo,
                descripcion: `${contador}° ${key}`,
            })

            // Avanzar el inicio para el próximo período
            fechaInicio.setDate(fechaInicio.getDate() + duracion)
            contador++
        }

        return periodos
    }

    setFasesYear(
        {onCompleteCallbacks = []} : {onCompleteCallbacks?: (() => void)[]} = {}
    ): Observable<any> | void {
        this.httpService
            .getData('acad/calendarioAcademico/selFasesYear')
            .subscribe({
                next: (data) => {

                    console.log(data)
                    // const filterYearActive = JSON.parse(
                    //     data.data[0][
                    //         'JSON_F52E2B61-18A1-11d1-B105-00805F49916B'
                    //     ]
                    // )[0]

                    // console.log('Fecha vigente')
                    // console.log(filterYearActive)

                    this.setTicketInformation(
                        {
                            iSedeId: JSON.parse(
                                localStorage.getItem('dremoPerfil')
                            ).iSedeId,
                            iYAcadId: data.data.yearAcad.iYAcadId,
                        },
                        'calendar'
                    )

                    this.setTicketInformation(
                        {
                            fechaInicio: new Date(
                                data.data.yearAcad.dtYAcadInicio
                            ),
                            fechaFin: new Date(data.data.yearAcad.dYAcadFin),
                            fechaVigente: data.data.yearAcad.cYAcadNombre,
                        },
                        'stepYear'
                    )
                },

                error: () => {},

                complete: () => {
                    onCompleteCallbacks.forEach((callback) => callback())
                },
            })
    }

    setCalendar({
        iSedeId,
        iYAcadId,
        iCalAcadId,
    }: typeof this.registroInformation.calendar) {
        if (!this.registroInformation) {
            this.registroInformation = {}; // Inicializa el objeto si es necesario
        }
    
        this.registroInformation.calendar = {
            iCalAcadId: iCalAcadId,
            iSedeId: iSedeId,
            iYAcadId: iYAcadId,
        }
    }

    getCalendar(
        {
            iSedeId,
            iYAcadId,
            iCalAcadId,
        }: { iSedeId: string; iYAcadId: string; iCalAcadId: string },
        onNextCallbacks: (() => void)[] = [],
        returnObservable: boolean = true
    ) {
        this.httpService
            .postData('acad/calendarioAcademico/addCalAcademico', {
                calAcad: JSON.stringify({
                    iSedeId: JSON.parse(localStorage.getItem('dremoPerfil')).iSedeId,
                    iYAcadId: '',
                    dtCalAcadInicio: '',
                    dtCalAcadFin: '',
                    dtCalAcadMatriculaInicio: '',
                    dtCalAcadMatriculaFin: '',
                    bCalAcadFaseRegular: '',
                    bCalAcadFaseRecuperacion: '',
                }),
                calFaseProm: JSON.stringify({

                })
            })
            .subscribe({
                next: (data: any) => {
                    let filterCalendar = JSON.parse(
                        data.data[0]['calendarioAcademico']
                    )

                    console.log('getCalendarioIESede')
                    console.log(filterCalendar)
                },
                error: (error) => {
                    console.error('Error fetching turnos:', error)
                },
                complete: () => {},
            })

        const request$ = this.httpService
            .postData('acad/calendarioAcademico/addCalAcademico', {
                json: JSON.stringify({
                    iSedeId: iSedeId,
                    iYAcadId: iYAcadId,
                    iCalAcadId: iCalAcadId,
                }),
                _opcion: 'getCalendarioIE',
            })
            .pipe(
                tap((data: any) => {
                    console.log('getCalendarioIE')
                    console.log(data)

                    onNextCallbacks.forEach((callback) => callback())
                }),
                catchError((error) => {
                    console.error('Error fetching turnos:', error)
                    return throwError(() => error)
                })
            )

        // Devuelve el Observable solo si returnObservable es true
        if (returnObservable) {
            return request$
        } else {
            // Ejecuta la suscripción internamente y retorna un Observable vacío
            request$.subscribe()
            return EMPTY
        }
    }

    getCalendarioIESede() {
        this.httpService
            .postData('acad/calendarioAcademico/addCalAcademico', {
                json: JSON.stringify({
                    iSedeId: JSON.parse(localStorage.getItem('dremoPerfil'))
                        .iSedeId,
                    // iYAcadId: this.ticketService.registroInformation.stepYear.,
                    iCalAcadId: '23',
                }),
                _opcion: 'getCalendarioIESede',
            })
            .subscribe({
                next: (data: any) => {
                    let filterCalendar = JSON.parse(
                        data.data[0]['calendarioAcademico']
                    )

                    console.log('getCalendarioIESede')
                    console.log(filterCalendar)
                },
                error: (error) => {
                    console.error('Error fetching turnos:', error)
                },
                complete: () => {},
            })
    }

    getDiasLaborales(
        { iCalAcadId }: { iCalAcadId: string },
        returnObservable: boolean = true
    ): Observable<any> {
        const request$ = this.httpService
            .postData('acad/calendarioAcademico/addCalAcademico', {
                json: JSON.stringify({
                    iCalAcadId: iCalAcadId,
                }),
                _opcion: 'getCalendarioDiasLaborables',
            })
            .pipe(
                tap((data: any) => {
                    const filterDiasLaborales = JSON.parse(
                        data.data[0]['calDiasDatos']
                    ).map((dia) => ({
                        iDiaLabId: String(dia.iDiaLabId),
                        iDiaId: String(dia.iDiaId),
                        iDia: String(dia.iDiaId),
                        cDiaNombre: dia.cDiaNombre,
                        cDiaAbreviado: dia.cDiaAbreviado,
                    }))
                }),
                catchError((error) => {
                    console.error('Error fetching turnos:', error)
                    return throwError(() => error)
                })
            )

        // Devuelve el Observable solo si returnObservable es true
        if (returnObservable) {
            return request$
        } else {
            // Ejecuta la suscripción internamente y retorna un Observable vacío
            request$.subscribe()
            return EMPTY
        }
    }

    getFormasAtencion(
        { iCalAcadId }: { iCalAcadId: string },
        returnObservable: boolean = true
    ): Observable<any> {
        const request$ = this.httpService
            .postData('acad/calendarioAcademico/addCalAcademico', {
                json: JSON.stringify({
                    iCalAcadId: iCalAcadId,
                }),
                _opcion: 'getCalendarioTurnos',
            })
            .pipe(
                tap((data: any) => {
                    this.setTicketInformation(
                        data.data.map((turno) => ({
                            iCalTurnoId: turno.iCalTurnoId,
                            iTurnoId: turno.iTurnoId,
                            iModalServId: turno.iModalServId,
                            iCalAcadId: turno.iCalAcadId,
                            dtTurnoInicia: turno.dtTurnoInicia,
                            dtTurnoFin: turno.dtTurnoFin,
                            cModalServNombre: turno.cModalServNombre,
                            cTurnoNombre: turno.cTurnoNombre,
                            dtAperTurnoInicio: turno.dtAperTurnoInicio,
                            dtAperTurnoFin: turno.dtAperTurnoFin,
                        })),
                        'stepFormasAtencion'
                    )
                }),
                catchError((error) => {
                    console.error('Error fetching turnos:', error)
                    return throwError(() => error)
                })
            )

        // Devuelve el Observable solo si returnObservable es true
        if (returnObservable) {
            return request$
        } else {
            // Ejecuta la suscripción internamente y retorna un Observable vacío
            request$.subscribe()
            return EMPTY
        }
    }

    getPeriodosAcademicos(
        { iCalAcadId }: { iCalAcadId: string },
        returnObservable: boolean = true
    ): Observable<any> {
        const request$ = this.httpService
            .postData('acad/calendarioAcademico/addCalAcademico', {
                json: JSON.stringify({
                    iCalAcadId: iCalAcadId,
                }),
                _opcion: 'getCalendarioPeriodos',
            })
            .pipe(
                tap((data: any) => {}),
                catchError((error) => {
                    console.error('Error fetching modalidades:', error)
                    return throwError(() => error)
                })
            )

        // Devuelve el Observable si returnObservable es true
        if (returnObservable) {
            return request$
        } else {
            // Ejecuta la suscripción internamente y retorna un Observable vacío
            request$.subscribe()
            return EMPTY
        }
    }

    add_CalendarioFaseAcad({
        onNextCallbacks = [],
        onCompleteCallbacks = [],
    }: {
        onNextCallbacks: (() => void)[]
        onCompleteCallbacks: (() => void)[]
    }) {
        this.httpService
            .postData('acad/calendarioAcademico/addCalendarioFasesAcad', {
                calAcad: JSON.stringify({
                    iSedeId: JSON.parse(localStorage.getItem('dremoPerfil')).iSedeId,
                    iYAcadId: this.registroInformation.calendar.iYAcadId,
                    dtCalAcadInicio: this.registroInformation.stepYear.fechaInicio,
                    dtCalAcadFin: this.registroInformation.stepYear.fechaFin,
                    dtCalAcadMatriculaInicio: this.registroInformation.stepYear.matriculaInicio,
                    dtCalAcadMatriculaResagados: '',
                    bCalAcadFaseRegular: this.registroInformation.stepYear.bCalAcadFaseRegular,
                    bCalAcadFaseRecuperacion: this.registroInformation.stepYear.bCalAcadFaseRecuperacion,
                }),
                calFaseProm: JSON.stringify(this.registroInformation.stepYear.fases_promocionales),
            })
            .subscribe({
                next: (data) => {
                    const filterYearActive = JSON.parse(
                        data.data[0][
                            'JSON_F52E2B61-18A1-11d1-B105-00805F49916B'
                        ]
                    )[0]

                    console.log('Fecha vigente')
                    console.log(filterYearActive)

                    this.setTicketInformation(
                        {
                            iSedeId: JSON.parse(
                                localStorage.getItem('dremoPerfil')
                            ).iSedeId,
                            iYAcadId: filterYearActive.iYAcadId,
                        },
                        'calendar'
                    )

                    this.setTicketInformation(
                        {
                            fechaInicio: new Date(
                                filterYearActive.dtYAcadInicio
                            ),
                            fechaFin: new Date(filterYearActive.dYAcadFin),
                            fechaVigente: filterYearActive.cYAcadNombre,
                        },
                        'stepYear'
                    )
                    onNextCallbacks.forEach((callback) => callback())
                },

                error: () => {},

                complete: () => {
                    onCompleteCallbacks.forEach((callback) => callback())
                },
            })
    }
}
