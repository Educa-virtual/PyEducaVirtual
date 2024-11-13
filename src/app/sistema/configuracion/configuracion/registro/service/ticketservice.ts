import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { httpService } from '../../http/httpService'
import { firstValueFrom } from 'rxjs'

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
            matriculaResagados: Date
            bCalAcadFaseRegular?: boolean
            bCalAcadFaseRecuperacion?: boolean
            fases_promocionales?: {
                iFaseId?: string
                iFasePromId?: number
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

        if (tipo === 'trimestral') {
            key = 'trimestre' // Retorna la clave si el valor coincide
        }
        if (tipo === 'semestral') {
            key = 'semestre' // Retorna la clave si el valor coincide
        }
        if (tipo === 'bimestral') {
            key = 'bimestre' // Retorna la clave si el valor coincide
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
    async getFasesFechas() {
        return await firstValueFrom(
            this.httpService.getData('acad/calendarioAcademico/selFasesFechas')
        )
    }

    async setCalendar(
        { iCalAcadId }: Partial<typeof this.registroInformation.calendar> = {},
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

        let fasesFechas = await this.getFasesFechas()

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
        } else {
            console.log('SIN ID')

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
            const { iSedeId, iYAcadId } = this.registroInformation.calendar

            const data = await firstValueFrom(
                this.httpService.postData(
                    'acad/calendarioAcademico/insCalAcademico',
                    {
                        calAcad: JSON.stringify({
                            iSedeId: iSedeId,
                            iYAcadId: iYAcadId,
                            dtCalAcadInicio:
                                this.toSQLDatetimeFormat(calAcad.fechaInicio) ??
                                null,
                            dtCalAcadFin:
                                this.toSQLDatetimeFormat(calAcad.fechaFin) ??
                                null,
                            dtCalAcadMatriculaInicio:
                                this.toSQLDatetimeFormat(
                                    calAcad.fechaMatriculaInicio
                                ) ?? null,
                            dtCalAcadMatriculaFin:
                                this.toSQLDatetimeFormat(
                                    calAcad.fechaMatriculaFin
                                ) ?? null,
                            dtCalAcadMatriculaResagados:
                                this.toSQLDatetimeFormat(
                                    calAcad.fechaMatriculaRezagados
                                ) ?? null,
                            bCalAcadFaseRegular: calAcad.regular.includes(true),
                            bCalAcadFaseRecuperacion:
                                calAcad.recuperacion.includes(true),
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
                            dtCalAcadInicio: this.toSQLDatetimeFormat(
                                calAcad.fechaInicio
                            ),
                            dtCalAcadFin: this.toSQLDatetimeFormat(
                                calAcad.fechaFin
                            ),
                            dtCalAcadMatriculaInicio: this.toSQLDatetimeFormat(
                                calAcad.fechaMatriculaInicio
                            ),
                            dtCalAcadMatriculaFin: this.toSQLDatetimeFormat(
                                calAcad.fechaMatriculaFin
                            ),
                        }),
                        iCalAcadId: iCalAcadId,
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
        { form, insFase },
        {
            onNextCallbacks = [],
            onCompleteCallbacks = [],
        }: {
            onNextCallbacks?: (() => void)[]
            onCompleteCallbacks?: (() => void)[]
        } = {}
    ) {
        try {
            let fasePromocional

            if (
                Array.isArray(
                    this.registroInformation.stepYear.fases_promocionales
                )
            ) {
                fasePromocional =
                    this.registroInformation.stepYear.fases_promocionales.find(
                        (fase) => fase.iFasePromId == insFase.iFasePromId
                    )
            }

            if (fasePromocional == null || fasePromocional == undefined) {
                await firstValueFrom(
                    this.httpService.postData(
                        'acad/calendarioAcademico/insCalFasesProm',
                        {
                            calFasesProm: JSON.stringify({
                                iCalAcadId:
                                    this.registroInformation.calendar
                                        .iCalAcadId,
                                iFasePromId: insFase.iFasePromId,
                                dtFaseInicio: form.faseInicio,
                                dtFaseFin: form.faseFinal,
                            }),
                        }
                    )
                )
            }
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
            console.log('fases')
            console.log(this.registroInformation.stepYear.fases_promocionales)

            const fasePromocional =
                Array.isArray(
                    this.registroInformation.stepYear.fases_promocionales
                ) &&
                this.registroInformation.stepYear.fases_promocionales.find(
                    (fase) => fase.iFasePromId == deleteFasesProm.iFasePromId
                )

            if (fasePromocional != null) {
                await firstValueFrom(
                    this.httpService.deleteData(
                        'acad/calendarioAcademico/deleteCalFasesProm',
                        {
                            iFaseId: fasePromocional.iFaseId,
                        }
                    )
                )
            }

            onNextCallbacks.forEach((callback) => callback())
            onCompleteCallbacks.forEach((callback) => callback())
        } catch (err) {
            console.error('Error en deleteCalFasesProm:', err)
        }
    }

    async setCalDiasLaborales() {
        const dias = await firstValueFrom(
            this.httpService.getData(
                `acad/calendarioAcademico/selCalDiasLaborales?iCalAcadId=${this.registroInformation.calendar.iCalAcadId}`
            )
        )

        console.log('dias')
        console.log(dias)

        this.setTicketInformation({
            ...dias
        }, 'stepDiasLaborales')
    }

    async insCalDiasLaborales(dias){

        dias = dias.map((dia) => ({
            iDiaId: dia.iDiaId,
            iCalAcadId: this.registroInformation.calendar.iCalAcadId,
        }))

        await firstValueFrom(
            this.httpService.postData(
                'acad/calendarioAcademico/insCalDiasLaborales',
                {
                    json: JSON.stringify(dias)
                }
            )
        )

    }

}
