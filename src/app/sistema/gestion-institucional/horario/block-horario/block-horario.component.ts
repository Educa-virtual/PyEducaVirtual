import { PrimengModule } from '@/app/primeng.module'
import { InputNumberModule } from 'primeng/inputnumber'
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'

// Modelo para representar un bloque o receso
export interface BloqueHorario {
    inicio: string // Hora de inicio (formato HH:mm)
    fin: string // Hora de fin (formato HH:mm)
    tipo: string // "Bloque" o "Receso"
    descripcion: string // Nombre del bloque o receso
}

@Component({
    selector: 'app-block-horario',
    standalone: true,
    imports: [PrimengModule, InputNumberModule],
    templateUrl: './block-horario.component.html',
    styleUrl: './block-horario.component.scss',
})
export class BlockHorarioComponent implements OnChanges, OnInit {
    @Output() addBlockHorario = new EventEmitter()
    @Input() bloque
    @Input() visible_bloque
    @Input() option
    @Input() items
    @Input() horarios

    form: FormGroup
    formGenerador: FormGroup

    open_modal: boolean = false
    personalizar: boolean = false
    bloques: any[] = []
    visible_block_registrado: boolean = false
    visble_block_generado: boolean = false

    lista_bloque = [
        { iTipoBloqueId: 1, cBloque: 'Bloque lectivo' },
        { iTipoBloqueId: 2, cBloque: 'Receso' },
    ]

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        console.log(this.horarios, ' registro en com ifhorarios')

        this.form = this.fb.group({
            bloques: this.fb.array([]),
        })

        this.formGenerador = this.fb.group({
            dtInicio: ['', Validators.required],
            dtFin: ['', Validators.required],
            n_bloque: [0],
            n_receso: [0],
            h_bloque: [0],
            cHorarioIeNombre: ['', Validators.required],
        })

        //this.generar();

        if (this.visible_bloque) {
            this.open_modal = false
            console.log(this.bloque, ' registro en com if visible')
            // this.mostrarModal()
        }
        // Cargar bloques desde el @Input()
        if (this.bloques && this.bloques.length > 0) {
            console.log(this.bloques, 'Que llega al componente')
            this.bloques.forEach((bloque) => this.agregarBloque(bloque))
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        // if (this.visible_bloque) {
        //     console.log(this.horarios, ' registro en com if visible')
        //     this.mostrarModal()
        // }

        if (changes['horarios'] && changes['horarios'].currentValue) {
            console.log(this.visible_bloque, ' registro en com if')
            //     if (this.visible_bloque) {
            console.log(this.bloque, ' registro en com if visible_bloque')
            //         this.mostrarModal()
        }
        if (this.items && this.items.length > 0) {
            console.log(this.items, 'Que llega al componente items')
            this.visble_block_generado = false
            this.visible_block_registrado = true
        }
    }

    // Getter para obtener el FormArray
    get bloquesFormArray(): FormArray {
        return this.form.get('bloques') as FormArray
    }

    // Método para crear un bloque
    private crearBloque(bloque?: {
        inicio: string
        fin: string
        tipo: string
        descripcion: string
    }): FormGroup {
        return this.fb.group({
            inicio: [bloque?.inicio || '', Validators.required],
            fin: [bloque?.fin || '', Validators.required],
            tipo: [bloque?.tipo || 'Bloque', Validators.required],
            descripcion: [bloque?.descripcion || '', Validators.required],
        })
    }

    //   // Cargar los bloques iniciales en el FormArray
    //   cargarBloques(): void {
    //     this.bloques.forEach((bloque) => {
    //       this.bloquesFormArray.push(
    //         this.fb.group({
    //           inicio: [bloque.inicio, [Validators.required]],
    //           fin: [bloque.fin, [Validators.required]],
    //           tipo: [bloque.tipo, [Validators.required]],
    //           descripcion: [bloque.descripcion, [Validators.required]],
    //         })
    //       );
    //     });
    //   }

    // Añadir un nuevo bloque
    // Método para agregar un bloque
    agregarBloque(bloque?: {
        inicio: string
        fin: string
        tipo: string
        descripcion: string
    }): void {
        this.bloquesFormArray.push(this.crearBloque(bloque))
    }

    // Eliminar un bloque
    eliminarBloque(index: number): void {
        this.bloquesFormArray.removeAt(index)
    }

    // Guardar los cambios (emite o procesa los datos)
    guardar(): void {
        const bloques_array = this.bloquesFormArray.value
        let cont_block = 0
        let cont_receso = 8

        const _array = bloques_array.map((horario) => ({
            ...horario,
            tipo: horario.tipo === 'Bloque' ? ++cont_block : ++cont_receso,
            cHorarioIeNombre: this.formGenerador.get('cHorarioIeNombre')?.value,
        }))

        this.addBlockHorario.emit(_array)

        if (this.form.valid) {
            console.log('Bloques guardados:', this.bloquesFormArray.value)
        } else {
            console.error('El formulario es inválido')
        }

        this.visble_block_generado = false
        this.visible_block_registrado = true
    }

    accionBtnItem(event: any) {
        switch (event) {
            case 'guardar':
                const registro = this.form.value
                this.addBlockHorario.emit(registro)
                break
        }
    }

    removeItem(index: number): void {
        index = index - 1
        this.items.splice(index, 1)
    }
    // addItem(){
    //     const iBloqueHorarioId = this.form.get('iBloqueHorarioId')?.value;
    //     const dtHorarioHInicio = this.form.get('dtHorarioHInicio')?.value;
    //     const dtHorarioHFin = this.form.get('dtHorarioHFin')?.value;

    //     // Función para extraer solo la hora en formato HH:mm
    //     const extractTime = (date: any): string => {
    //         if (!date) return '';
    //         const parsedDate = new Date(date);
    //         const hours = parsedDate.getHours().toString().padStart(2, '0');
    //         const minutes = parsedDate.getMinutes().toString().padStart(2, '0');
    //         return `${hours}:${minutes}`;
    //     };

    //     if (iBloqueHorarioId && dtHorarioHInicio && dtHorarioHFin) {
    //       const cBloqueHorarioNombre = this.bloques.find(option => option.iBloqueHorarioId === iBloqueHorarioId)?.cBloqueHorarioNombre || 'Sin bloque';
    //       const iTipoBloqueId = this.bloques.find(option => option.iBloqueHorarioId === iBloqueHorarioId)?.iTipoBloqueId || 'Sin bloque';
    //       this.items.push({
    //         id: this.items.length + 1,
    //         inicio: extractTime(dtHorarioHInicio),
    //         fin: extractTime(dtHorarioHFin),
    //         iBloqueHorarioId: iBloqueHorarioId,
    //         bloque: cBloqueHorarioNombre,
    //         iTipoBloqueId: iTipoBloqueId
    //       });
    //     } else {
    //       console.error('Error: Verifica que todos los campos del formulario estén llenos.');
    //     }
    // }

    accionBtnItemTable({ accion, item }) {
        if (accion === 'editar') {
            console.log(item, 'btnTable')
        }
        if (accion === 'retornar') {
            alert('Desea retornar')
            //this.router.navigate(['/gestion-institucional/configGradoSeccion'])
        }
    }

    generar() {
        // this.formGenerador.get('dtInicio')?.setValue('07:00');
        // this.formGenerador.get('dtFin')?.setValue('12:30');
        // this.formGenerador.get('n_bloque')?.setValue(7);
        // this.formGenerador.get('n_receso')?.setValue(1);
        // this.formGenerador.get('h_bloque')?.setValue(45);
        this.visble_block_generado = true
        this.visible_block_registrado = false

        const dtInicio = this.formGenerador.get('dtInicio')?.value
        const dtFin = this.formGenerador.get('dtFin')?.value

        // const inicio = dtInicio.getHours().toString().padStart(2, "0");
        // const fin = ("0" + dtFin).slice(-2);

        //const dtInicio = new Date("2024-12-30T07:30:00"); // Ejemplo
        //const dtFin = new Date("2024-12-30T12:30:00"); // Ejemplo

        // Obtener las horas y minutos formateados
        const inicioHora = dtInicio.getHours().toString().padStart(2, '0')
        const inicioMinuto = dtInicio.getMinutes().toString().padStart(2, '0')

        const finHora = dtFin.getHours().toString().padStart(2, '0')
        const finMinuto = dtFin.getMinutes().toString().padStart(2, '0')

        // Concatenar para obtener el formato HH:mm
        const inicio = `${inicioHora}:${inicioMinuto}`
        const fin = `${finHora}:${finMinuto}`

        this.generarHorario(
            inicio,
            fin,
            this.formGenerador.get('n_bloque')?.value,
            this.formGenerador.get('n_receso')?.value,
            this.formGenerador.get('h_bloque')?.value
        )
    }
    // Función para generar los bloques y recesos
    generarHorario(
        inicioTurno: string, // Hora de inicio del turno (formato HH:mm)
        finTurno: string, // Hora de fin del turno (formato HH:mm)
        numeroBloques: number, // Número total de bloques
        numeroRecesos: number, // Número total de recesos
        horaAcademica: number
    ): void {
        // const { inicioTurno, finTurno, numeroBloques, numeroRecesos } = this.form.value;

        const bloques: BloqueHorario[] = []
        const duracionBloque = horaAcademica // Duración fija de cada bloque en minutos
        const duracionReceso = 15 // Duración fija de cada receso en minutos

        const inicio = new Date(`1970-01-01T${inicioTurno}:00`)
        const fin = new Date(`1970-01-01T${finTurno}:00`)
        const tiempoTotal = (fin.getTime() - inicio.getTime()) / 60000 // Tiempo total del turno en minutos

        if (numeroBloques + numeroRecesos <= 0 || tiempoTotal <= 0) {
            throw new Error('Los datos de entrada no son válidos.')
        }

        const tiempoNecesario =
            numeroBloques * duracionBloque + numeroRecesos * duracionReceso

        console.log(
            tiempoNecesario,
            'tiempoNecesario',
            tiempoTotal,
            'tiempoTotal'
        )
        if (tiempoNecesario > tiempoTotal) {
            throw new Error(
                'El tiempo del turno no es suficiente para acomodar los bloques y recesos.'
            )
        }

        const horaActual = new Date(inicio)
        let bloqueCount = 1
        let recesoCount = 1

        for (let i = 1; i <= numeroBloques + numeroRecesos; i++) {
            const horaInicio = horaActual.toTimeString().slice(0, 5)
            let duracion = duracionBloque
            let tipo = 'Bloque'
            let descripcion = `Bloque ${bloqueCount}`

            if (
                i %
                    Math.ceil(
                        (numeroBloques + numeroRecesos) / numeroRecesos
                    ) ===
                0
            ) {
                duracion = duracionReceso
                tipo = 'Receso'
                descripcion = `Receso ${recesoCount}`
                recesoCount++
            } else {
                bloqueCount++
            }

            horaActual.setMinutes(horaActual.getMinutes() + duracion)
            const horaFin = horaActual.toTimeString().slice(0, 5)

            bloques.push({
                inicio: horaInicio,
                fin: horaFin,
                tipo,
                descripcion,
            })
        }
        this.bloques = bloques
        this.bloquesFormArray.clear()
        this.bloques.forEach((bloque) => this.agregarBloque(bloque))

        console.log(this.bloques, 'this.bloques')
        // this.horarioGenerado.emit(bloques); // Emitir el horario generado
    }
}
