import { PrimengModule } from '@/app/primeng.module'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
    selector: 'app-ficha-vivienda',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './ficha-vivienda.component.html',
    styleUrl: './ficha-vivienda.component.scss',
})
export class FichaViviendaComponent implements OnInit {
    form: FormGroup

    situaciones_vivienda: Array<object>
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

    visibleInput: Array<boolean>

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.situaciones_vivienda = [
            { id: 0, nombre: 'OTRO' },
            { id: 1, nombre: 'PROPIA' },
            { id: 2, nombre: 'PROPIA, COMPRÁNDOLA A PLAZOS' },
            { id: 3, nombre: 'ALQUILADA' },
            { id: 4, nombre: 'ANTICRESIS' },
            { id: 5, nombre: 'CEDIDA POR OTRO HOGAR' },
            { id: 6, nombre: 'ALOJADO' },
        ]

        this.pisos_vivienda = [
            { id: 1, nombre: 'UN PISO' },
            { id: 2, nombre: 'DOS PISOS' },
            { id: 3, nombre: 'TRES PISOS' },
            { id: 4, nombre: 'CUATRO PISOS' },
            { id: 5, nombre: 'MÁS DE CUATRO PISOS' },
        ]

        this.estados_vivienda = [
            { id: 0, nombre: 'OTRO' },
            { id: 1, nombre: 'TOTALMENTE CONSTRUIDA' },
            { id: 2, nombre: 'EN CONSTRUCCIÓN' },
            { id: 3, nombre: 'VIVIENDA IMPROVISADA' },
        ]

        this.tipos_vivienda = [
            { id: 0, nombre: 'OTRO TIPO DE VIVIENDA' },
            { id: 1, nombre: 'CASA INDEPENDIENTE' },
            { id: 2, nombre: 'DEPARTAMENTO EN EDIFICIO' },
            { id: 3, nombre: 'VIVIENDA EN QUINTA' },
            { id: 4, nombre: 'CUARTO / HABITACIÓN' },
        ]

        this.materiales_paredes_vivienda = [
            { id: 0, nombre: 'OTRO' },
            { id: 1, nombre: 'LADRILLO REVESTIDO' },
            { id: 2, nombre: 'LADRILLO NO REVESTIDO' },
            { id: 3, nombre: 'BLOQUETA DE CEMENTO REVESTIDO' },
            { id: 4, nombre: 'BLOQUETA DE CEMENTO NO REVESTIDO' },
            { id: 5, nombre: 'ADOBE' },
            { id: 6, nombre: 'QUINCHA (CAÑA CON BARRO)' },
            { id: 7, nombre: 'MADERA' },
            { id: 8, nombre: 'ESTERA' },
        ]

        this.materiales_pisos_vivienda = [
            { id: 0, nombre: 'OTRO' },
            { id: 1, nombre: 'PARQUET O MADERA PULIDA' },
            { id: 2, nombre: 'VINÍLICOS O SIMILARES' },
            { id: 3, nombre: 'LOSETAS' },
            { id: 4, nombre: 'CEMENTO' },
            { id: 5, nombre: 'TIERRA' },
        ]

        this.materiales_techos_vivienda = [
            { id: 0, nombre: 'OTRO' },
            { id: 1, nombre: 'CONCRETO ARMADO' },
            { id: 2, nombre: 'CALAMINA' },
            { id: 3, nombre: 'FIBRA DE CEMENTO' },
            { id: 4, nombre: 'ESTERA' },
        ]

        this.suministros_agua = [
            { id: 0, nombre: 'OTRO' },
            { id: 1, nombre: 'RED PÚBLICA DENTRO DE LA VIVIENDA' },
            {
                id: 2,
                nombre: 'RED PÚBLICA FUERA DE LA VIVIENDA, PERO DENTRO DEL EDIFICIO',
            },
            { id: 3, nombre: 'PILÓN DE USO PÚBLICO' },
            { id: 4, nombre: 'CAMIÓN - CISTERNA U OTRO SIMILAR' },
            { id: 5, nombre: 'RÍO, ACEQUIA, MANANTIAL O SIMILAR' },
        ]

        this.tipos_sshh = [
            { id: 0, nombre: 'OTRO' },
            { id: 1, nombre: 'RED PÚBLICA DE DESAGÜE' },
            { id: 2, nombre: 'LETRINA O SILO' },
        ]

        this.tipos_alumbrado = [
            { id: 0, nombre: 'OTRO' },
            { id: 1, nombre: 'ELECTRICIDAD' },
            { id: 2, nombre: 'MECHERO' },
            { id: 3, nombre: 'VELA' },
            { id: 4, nombre: 'PANEL SOLAR' },
        ]

        this.otros_elementos = [
            { id: 0, nombre: 'OTRO' },
            { id: 1, nombre: 'EQUIPO DE SONIDO' },
            { id: 2, nombre: 'TELEVISOR' },
            { id: 3, nombre: 'SERVICIO DE CABLE' },
            { id: 4, nombre: 'REFRIGERADORA / CONGELADORA' },
            { id: 5, nombre: 'COCINA A GAS' },
            { id: 6, nombre: 'TELEFONO FIJO' },
            { id: 7, nombre: 'CELULAR' },
            { id: 8, nombre: 'COMPUTADORA (PC)' },
            { id: 9, nombre: 'LAPTOP' },
            { id: 10, nombre: 'SERVICIO DE INTERNET HOGAR' },
            { id: 11, nombre: 'TABLET' },
            { id: 12, nombre: 'AUTOMÓVIL / CAMINETA' },
            { id: 13, nombre: 'MOTO / MOTOTAXI' },
        ]

        this.visibleInput = Array(10).fill(false)

        try {
            this.form = this.fb.group({
                iFichaDGId: [null, Validators.required],
                iTipoOcupaVivId: [null],
                cTipoOcupaVivDescripcion: [''],
                iEstadoVivId: [null],
                cEstadoVivDescripcion: [''],
                iViviendaCarNroPisos: [null],
                iViviendaCarNroAmbientes: [null],
                iViviendaCarNroHabitaciones: [null],
                iMatTecVivId: [null],
                cMatTecVivDescripcion: [''],
                iMatPisoVivId: [null],
                cMatPisoVivDescripcion: [''],
                iMatPreId: [null],
                cMatPreDescripcion: [''],
                iTipoSumAId: [null],
                cTipoSumADescripcion: [''],
                iTipoAlumId: [null],
                cTipoAlumDescripcion: [''],
                iEleParaVivId: [null],
                cEleParaVivDescripcion: [''],
                iTipoVivId: [null],
                cTipoVivDescripcion: [null],
                iTiposSsHhId: [null],
                cTiposSsHhDescripcion: [null],
            })
        } catch (error) {
            console.log(error, 'error inicializando formulario')
        }
    }

    handleDropdownChange(event: any, index: number) {
        if (event?.value === undefined) {
            this.visibleInput[index] = false
            return null
        }
        if (Array.isArray(event.value)) {
            if (event.value.includes(0)) {
                this.visibleInput[index] = true
            } else {
                this.visibleInput[index] = false
            }
        } else {
            if (event.value == 0) {
                this.visibleInput[index] = true
            } else {
                this.visibleInput[index] = false
            }
        }
    }

    guardarDatos() {
        console.log(this.form.value)
    }

    actualizarDatos() {
        console.log(this.form.value)
    }
}
