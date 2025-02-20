import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { httpService } from '../../http/httpService'
import { firstValueFrom } from 'rxjs'

// interface FormData {
//     entries(): IterableIterator<[string, FormDataEntryValue]>;
//   }

// interface FormData {
//     entries(): IterableIterator<[string, FormDataEntryValue]>;
//   }

export type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never

@Injectable()
export class TicketService {
    registroInformation: {
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
            matriculaResagados: Date
            bCalAcadFaseRegular?: boolean
            bCalAcadFaseRecuperacion?: boolean
            fases_promocionales?: {
                iFaseId?: string
                iFasePromId?: number
                cPeriodoEvalNombre?: string
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
            iFaseId: string
            dtPeriodoEvalAperInicio: string
            dtPeriodoEvalAperFin: string
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

    mergeRegistroInformation<T>(base: T, update: Partial<T>): T {
        return { ...base, ...update }
    }

    setTicketInformation<K extends keyof typeof this.registroInformation>(
        registroInformation: Partial<(typeof this.registroInformation)[K]>,
        key: K
    ) {
        this.registroInformation[key] = this.mergeRegistroInformation(
            this.registroInformation[key],
            registroInformation
        )
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

    async convertFormGroupToFormData(form) {
        const formData = new FormData()

        Object.entries(form).forEach(([key, value]) => {
            if (value instanceof File) {
                // Si es un archivo, accedemos a `name`
                console.log('Agregando form data')
                console.log(key, value)

                formData.append(key, value, value.name)
            } else if (value instanceof Blob) {
                // Si es un Blob genérico
                formData.append(key, value, 'archivo-sin-nombre')
            } else if (typeof value === 'boolean') {
                // Si el valor es un booleano, lo convertimos a 'true' o 'false'
                formData.append(key, value.toString())
            } else if (typeof value === 'string') {
                formData.append(key, value)
            } else {
                console.warn(
                    `El campo "${key}" tiene un valor no compatible:`,
                    value
                )
            }
        })

        return formData
    }

    async getFasesFechas() {
        return await firstValueFrom(
            this.httpService.getData('acad/calendarioAcademico/selFasesFechas')
        )
    }

    async setCalendar(
        { iCalAcadId }: { iCalAcadId?: string } = {},
        {
            onCompleteCallbacks = [],
        }: {
            onCompleteCallbacks?: ((data) => void)[]
        } = {}
    ) {
        if (!this.registroInformation) {
            this.registroInformation = {} // Inicializa el objeto si es necesario
        }

        let data: any

        const fasesFechas = await this.getFasesFechas()

        const id =
            (iCalAcadId || this.registroInformation.calendar?.iCalAcadId) ?? ''

        const sede =
            this.registroInformation.calendar?.iSedeId ??
            JSON.parse(localStorage.getItem('dremoPerfil')).iSedeId

        if (id) {
            console.log('Con ID')
            console.log(id)

            data = await firstValueFrom(
                this.httpService.getData(
                    `acad/calendarioAcademico/selCalAcademico?iCalAcadId=${id}`
                )
            )
            console.log(data)

            this.setTicketInformation(
                {
                    iCalAcadId: data.data.iCalAcadId,
                    iSedeId: data.data.iSedeId,
                    iYAcadId: data.data.iYAcadId,
                },
                'calendar'
            )

            this.setTicketInformation(
                {
                    fechaVigente: data.data.cYearNombre,
                    fechaInicio: new Date(data.data.dtCalAcadInicio),
                    fechaFin: new Date(data.data.dtCalAcadFin),
                    matriculaInicio:
                        new Date(data.data.dtCalAcadMatriculaInicio) ?? null,
                    matriculaFin:
                        new Date(data.data.dtCalAcadMatriculaFin) ?? null,
                    matriculaResagados:
                        new Date(data.data.dtCalAcadMatriculaResagados) ?? null,
                    fases_promocionales:
                        JSON.parse(data.data.fasesPromocionales) ?? null,
                },
                'stepYear'
            )

            if (data.data.diasLaborales) {
                this.registroInformation.stepDiasLaborales = JSON.parse(
                    data.data.diasLaborales ?? undefined
                )
            }

            if (data.data.formasAtencion) {
                this.registroInformation.stepFormasAtencion =
                    JSON.parse(data.data.formasAtencion) ?? undefined
            } else {
                this.registroInformation.stepFormasAtencion = []
            }

            if (data.data.periodosAcademicos) {
                this.registroInformation.stepPeriodosAcademicos =
                    JSON.parse(data.data.periodosAcademicos) ?? undefined
            }
        } else {
            console.log('SIN ID')

            console.log('Fase y fecha')
            console.log(fasesFechas)

            data = await firstValueFrom(
                this.httpService.getData(
                    'acad/calendarioAcademico/selFasesFechas'
                )
            )

            console.log('Data:')
            console.log(data)

            this.setTicketInformation(
                {
                    iCalAcadId: '',
                    iSedeId: sede,
                    iYAcadId: fasesFechas.data.yearAcad.iYAcadId,
                },
                'calendar'
            )

            this.setTicketInformation(
                {
                    fechaVigente: fasesFechas.data.yearAcad.cYAcadNombre,
                    fechaInicio: new Date(
                        fasesFechas.data.yearAcad.dtYAcadInicio
                    ),
                    fechaFin: new Date(fasesFechas.data.yearAcad.dYAcadFin),
                },
                'stepYear'
            )
        }
        onCompleteCallbacks.forEach((callback) => callback(fasesFechas.data))
    }

    getCalendarioIESede({
        onNextCallbacks = [],
        onCompleteCallbacks = [],
    }: {
        onNextCallbacks?: ((data: any) => void)[]
        onCompleteCallbacks?: (() => void)[]
    } = {}) {
        this.httpService
            .getData(
                `acad/calendarioAcademico/selCalAcademicoSede?iSedeId=${
                    JSON.parse(localStorage.getItem('dremoPerfil')).iSedeId
                }`
            )
            .subscribe({
                next: (data: any) => {
                    onNextCallbacks.forEach((callback) => callback(data.data))
                },
                error: (error) => {
                    console.error('Error fetching turnos:', error)
                },
                complete: () => {
                    onCompleteCallbacks.forEach((callback) => callback())
                },
            })
    }

    async insCalAcademico(
        calAcad,
        {
            onNextCallbacks = [],
            onCompleteCallbacks = [],
        }: {
            onNextCallbacks?: (() => void)[]
            onCompleteCallbacks?: (() => void)[]
        } = {}
    ) {
        try {
            const { iCalAcadId, iSedeId, iYAcadId } =
                this.registroInformation.calendar

            const data = await firstValueFrom(
                this.httpService.postData(
                    'acad/calendarioAcademico/insCalAcademico',
                    {
                        json: JSON.stringify({
                            iCalAcadId: iCalAcadId,
                            iSedeId: iSedeId,
                            iYAcadId: iYAcadId,
                            dtCalAcadInicio:
                                this.toSQLDatetimeFormat(
                                    calAcad.fechaInicio[0]
                                ) ?? null,
                            dtCalAcadFin:
                                this.toSQLDatetimeFormat(
                                    calAcad.fechaInicio[1]
                                ) ?? null,
                            dtCalAcadMatriculaInicio:
                                this.toSQLDatetimeFormat(
                                    calAcad.fechaMatriculaFin[0]
                                ) ?? null,
                            dtCalAcadMatriculaFin:
                                this.toSQLDatetimeFormat(
                                    calAcad.fechaMatriculaFin[1]
                                ) ?? null,
                            dtCalAcadMatriculaResagados:
                                this.toSQLDatetimeFormat(
                                    calAcad.fechaMatriculaRezagados[1]
                                ) ?? null,
                            bCalAcadFaseRegular: true,
                            bCalAcadFaseRecuperacion: true,
                        }),
                    }
                )
            )

            this.setTicketInformation(
                {
                    iCalAcadId: String(data.data[0].id),
                },
                'calendar'
            )

            onNextCallbacks.forEach((callback) => callback())

            onCompleteCallbacks.forEach((callback) => callback())
        } catch (err) {
            console.error('Error en insCalAcademico:', err)
        }
    }

    async updCalAcademico(
        calAcad,
        {
            onNextCallbacks = [],
            onCompleteCallbacks = [],
        }: {
            onNextCallbacks?: (() => void)[]
            onCompleteCallbacks?: (() => void)[]
        } = {}
    ) {
        try {
            const { iCalAcadId } = this.registroInformation.calendar

            await firstValueFrom(
                this.httpService.putData(
                    'acad/calendarioAcademico/updCalAcademico',
                    {
                        calAcad: JSON.stringify({
                            iCalAcadId: iCalAcadId,
                            dtCalAcadInicio: this.toSQLDatetimeFormat(
                                calAcad.fechaInicio[0]
                            ),
                            dtCalAcadFin: this.toSQLDatetimeFormat(
                                calAcad.fechaInicio[1]
                            ),
                            dtCalAcadMatriculaInicio: this.toSQLDatetimeFormat(
                                calAcad.fechaMatriculaFin[0]
                            ),
                            dtCalAcadMatriculaFin: this.toSQLDatetimeFormat(
                                calAcad.fechaMatriculaFin[1]
                            ),
                            dtCalAcadMatriculaResagados:
                                this.toSQLDatetimeFormat(
                                    calAcad.fechaMatriculaRezagados[1]
                                ),
                            bCalAcadFaseRegular: false,
                            bCalAcadFaseRecuperacion: false,
                        }),
                    }
                )
            )
            onNextCallbacks.forEach((callback) => callback())

            onCompleteCallbacks.forEach((callback) => callback())
        } catch (error) {
            console.error('Error en insCalAcademico:', error)
        }
    }

    async setReglamentoInterno() {
        return await firstValueFrom(
            this.httpService.getData(
                `acad/institucionEducativa/selReglamentoInterno?iIieeId=${JSON.parse(localStorage.getItem('dremoPerfil')).iIieeId}`
            )
        )
    }

    base64ToFile(
        base64String: string,
        fileName: string,
        mimeType: string
    ): File {
        // Eliminar el encabezado 'data:*/*;base64,' si está presente
        const base64Data = base64String.startsWith('data:')
            ? base64String.split(',')[1]
            : base64String

        // Decodificar la cadena Base64 a bytes
        const byteCharacters = atob(base64Data)

        // Crear un array de bytes de la cadena decodificada
        const byteArrays = []
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512)
            const byteNumbers = new Array(slice.length)
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i)
            }
            byteArrays.push(new Uint8Array(byteNumbers))
        }

        // Crear un Blob con los bytes y el tipo MIME del archivo
        const blob = new Blob(byteArrays, { type: mimeType })

        // Crear un objeto File a partir del Blob
        return new File([blob], fileName, { type: mimeType })
    }

    async updReglamentoInterno(calAcad) {
        const formData = await this.convertFormGroupToFormData({
            cIieeUrlReglamentoInterno: calAcad.reglamentoInterno,
            iIieeId: JSON.parse(localStorage.getItem('dremoPerfil')).iIieeId,
        })

        await firstValueFrom(
            this.httpService.putData(
                'acad/institucionEducativa/updReglamentoInterno',
                formData
            )
        )
    }

    async updCalFasesProm(
        calFasesProm,
        {
            onNextCallbacks = [],
            onCompleteCallbacks = [],
        }: {
            onNextCallbacks?: (() => void)[]
            onCompleteCallbacks?: (() => void)[]
        } = {}
    ) {
        try {
            await firstValueFrom(
                this.httpService.putData(
                    'acad/calendarioAcademico/updCalFasesProm',
                    {
                        calFases: JSON.stringify(
                            calFasesProm.map((fase) => ({
                                iFaseId: fase.iFaseId,
                                iCalAcadId:
                                    this.registroInformation.calendar
                                        .iCalAcadId,
                                iFasePromId: fase.iFasePromId,
                                dtFaseInicio: fase.dtFaseInicio,
                                dtFaseFin: fase.dtFaseFin,
                            }))
                        ),
                    }
                )
            )
            onNextCallbacks.forEach((callback) => callback())

            onCompleteCallbacks.forEach((callback) => callback())
        } catch (error) {
            console.error('Error en insCalAcademico:', error)
        }
    }

    updCalFasesFechas({
        onNextCallbacks = [],
        onCompleteCallbacks = [],
    }: {
        onNextCallbacks?: (() => void)[]
        onCompleteCallbacks?: (() => void)[]
    } = {}) {
        this.httpService
            .putData('acad/calendarioAcademico/updCalFasesFechas', {})
            .subscribe({
                next: () => {
                    onNextCallbacks.forEach((callback) => callback())
                },

                error: () => {},

                complete: () => {
                    onCompleteCallbacks.forEach((callback) => callback())
                },
            })
    }

    async setCalFasesProm({
        onNextCallbacks = [],
        onCompleteCallbacks = [],
    }: {
        onNextCallbacks?: (() => void)[]
        onCompleteCallbacks?: ((data) => void)[]
    } = {}) {
        try {
            const data = await firstValueFrom(
                this.httpService.getData(
                    `acad/calendarioAcademico/selCalFasesProm?iCalAcadId=${this.registroInformation.calendar.iCalAcadId}`
                )
            )

            onNextCallbacks.forEach((callback) => callback())
            onCompleteCallbacks.forEach((callback) => callback(data))
        } catch (err) {
            console.error('Error en insCalAcademico:', err)
        }
    }

    async insCalFasesProm(
        calFasesProm,
        {
            onNextCallbacks = [],
            onCompleteCallbacks = [],
        }: {
            onNextCallbacks?: (() => void)[]
            onCompleteCallbacks?: (() => void)[]
        } = {}
    ) {
        try {
            await firstValueFrom(
                this.httpService.postData(
                    'acad/calendarioAcademico/insCalFasesProm',
                    {
                        calFasesProm: JSON.stringify(
                            calFasesProm.map((fase) => ({
                                iCalAcadId:
                                    this.registroInformation.calendar
                                        .iCalAcadId,
                                iFasePromId: fase.iFasePromId,
                                dtFaseInicio: fase.dtFaseInicio,
                                dtFaseFin: fase.dtFaseFin,
                            }))
                        ),
                    }
                )
            )
            onNextCallbacks.forEach((callback) => callback())
            onCompleteCallbacks.forEach((callback) => callback())
        } catch (err) {
            console.error('Error en insCalAcademico:', err)
        }
    }

    async deleteCalFasesProm(
        deleteFasesProm,
        {
            onNextCallbacks = [],
            onCompleteCallbacks = [],
        }: {
            onNextCallbacks?: (() => void)[]
            onCompleteCallbacks?: (() => void)[]
        } = {}
    ) {
        try {
            await firstValueFrom(
                this.httpService.deleteData(
                    'acad/calendarioAcademico/deleteCalFasesProm',
                    {
                        deleteFasesProm: JSON.stringify(
                            deleteFasesProm.map((fase) => ({
                                iFaseId: fase.iFaseId,
                            }))
                        ),
                    }
                )
            )

            onNextCallbacks.forEach((callback) => callback())
            onCompleteCallbacks.forEach((callback) => callback())
        } catch (err) {
            console.error('Error en deleteCalFasesProm:', err)
        }
    }

    async selDias() {
        return await firstValueFrom(
            this.httpService.getData('acad/calendarioAcademico/selDias')
        )
    }

    async insCalDiasLaborales(dias) {
        dias = dias.map((dia) => ({
            iDiaId: dia.iDiaId,
            iCalAcadId: this.registroInformation.calendar.iCalAcadId,
        }))

        await firstValueFrom(
            this.httpService.postData(
                'acad/calendarioAcademico/insCalDiasLaborales',
                {
                    json: JSON.stringify(dias),
                }
            )
        )
    }

    async deleteCalDiasLaborales(dias) {
        dias = dias.map((dia) => ({
            iDiaLabId: dia.iDiaLabId,
        }))

        await firstValueFrom(
            this.httpService.deleteData(
                'acad/calendarioAcademico/deleteCalDiasLaborales',
                {
                    calDiasLaborales: JSON.stringify(dias),
                }
            )
        )
    }

    async selTurnosModalidades() {
        return await firstValueFrom(
            this.httpService.getData(
                'acad/calendarioAcademico/selTurnosModalidades'
            )
        )
    }

    async insCalFormasAtencion(formaAtencion) {
        console.log(formaAtencion)
        await firstValueFrom(
            this.httpService.postData(
                'acad/calendarioAcademico/insCalFormasAtencion',
                {
                    json: JSON.stringify({
                        iTurnoId: formaAtencion.turno.iTurnoId,
                        iModalServId: formaAtencion.modalidad.iModalServId,
                        iCalAcadId:
                            this.registroInformation.calendar.iCalAcadId,
                        dtAperTurnoInicio: this.convertToSQLDateTime(
                            formaAtencion.horaInicio
                        ),
                        dtAperTurnoFin: this.convertToSQLDateTime(
                            formaAtencion.horaFin
                        ),
                    }),
                }
            )
        )
    }

    async updFormasAtencion(formasAtencion) {
        await firstValueFrom(
            this.httpService.putData(
                'acad/calendarioAcademico/updCalFormasAtencion',
                {
                    json: JSON.stringify({
                        iCalTurnoId: formasAtencion.id,
                        iTurnoId: formasAtencion.turno.iTurnoId,
                        iModalServId: formasAtencion.modalidad.iModalServId,
                        iCalAcadId:
                            this.registroInformation.calendar.iCalAcadId,
                        dtAperTurnoInicio: this.convertToSQLDateTime(
                            formasAtencion.horaInicio
                        ),
                        dtAperTurnoFin: this.convertToSQLDateTime(
                            formasAtencion.horaFin
                        ),
                    }),
                }
            )
        )
    }

    async deleteFormasAtencion(formasAtencion) {
        await firstValueFrom(
            this.httpService.deleteData(
                'acad/calendarioAcademico/deleteCalFormasAtencion',
                {
                    json: JSON.stringify({
                        iCalTurnoId: formasAtencion.iCalTurnoId,
                    }),
                }
            )
        )
    }

    async selPeriodosFormativos() {
        return await firstValueFrom(
            this.httpService.getData(
                'acad/calendarioAcademico/selPeriodosFormativos'
            )
        )
    }

    calculandoPeriodosFormativos(periodos, fase) {
        const inicio = new Date(fase.dtFaseInicio)
        const fin = new Date(fase.dtFaseFin)

        let cantidadPeriodos
        let duracionMeses
        let tipoPeriodo = ''

        // Determinar la cantidad de periodos y la duración en meses
        if (periodos.iPeriodoEvalCantidad == 6) {
            cantidadPeriodos = 2
            duracionMeses = 6
            tipoPeriodo = 'Semestre'
        } else if (periodos.iPeriodoEvalCantidad == 3) {
            cantidadPeriodos = 3
            duracionMeses = 3
            tipoPeriodo = 'Trimestre'
        } else if (periodos.iPeriodoEvalCantidad == 2) {
            cantidadPeriodos = 6
            duracionMeses = 2
            tipoPeriodo = 'Bimestre'
        } else {
            throw new Error(
                'Cantidad de periodos no válida. Debe ser 2 (Semestre), 3 (Trimestre) o 6 (Bimestre).'
            )
        }

        const periodosAcad = []
        let inicioPeriodo = new Date(inicio)

        // Crear cada periodo académico con la duración en meses específica
        for (let i = 0; i < cantidadPeriodos; i++) {
            // Calcular la fecha de fin del periodo sumando duracionMeses
            let finPeriodo = new Date(inicioPeriodo)
            finPeriodo.setMonth(finPeriodo.getMonth() + duracionMeses)
            finPeriodo.setDate(finPeriodo.getDate() - 1) // Ajuste para el último día del periodo

            // Ajustar el fin del periodo si excede el fin de la fase
            if (finPeriodo > fin) {
                finPeriodo = new Date(fin)
            }

            periodosAcad.push({
                tipo: tipoPeriodo,
                inicio: new Date(inicioPeriodo),
                fin: new Date(finPeriodo),
            })

            // Avanzar al próximo inicio de periodo
            inicioPeriodo = new Date(finPeriodo)
            inicioPeriodo.setDate(inicioPeriodo.getDate() + 1) // Para empezar el día siguiente
        }

        return periodosAcad
    }

    async insPeriodosFormativos(periodosFormativos, fase, periodoType) {
        console.log('El periodo formativo a insertar')
        console.log(periodosFormativos)
        console.log(periodoType)
        const periodos = periodosFormativos.map((periodo) => ({
            iFaseId: fase.id,
            iPeriodoEvalId: periodoType.iPeriodoEvalId,
            dtPeriodoEvalAperInicio: this.toSQLDatetimeFormat(
                periodo.startDate
            ),
            dtPeriodoEvalAperFin: this.toSQLDatetimeFormat(periodo.endDate),
        }))

        return await firstValueFrom(
            this.httpService.postData(
                'acad/calendarioAcademico/insCalPeriodosFormativos',
                {
                    json: JSON.stringify(periodos),
                }
            )
        )
    }

    async updPeriodoFormativo() {
        console.log('actualizando')
    }

    async deleteCalPeriodosFormativos(periodos) {
        return await firstValueFrom(
            this.httpService.deleteData(
                'acad/calendarioAcademico/deleteCalPeriodosFormativos',
                {
                    json: JSON.stringify(
                        periodos.map((periodo) => ({
                            iPeriodoEvalAperId: periodo.iPeriodoEvalAperId,
                        }))
                    ),
                }
            )
        )
    }
}
