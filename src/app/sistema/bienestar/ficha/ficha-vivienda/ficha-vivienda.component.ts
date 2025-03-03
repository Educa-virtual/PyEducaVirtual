import { PrimengModule } from '@/app/primeng.module'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'

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
    conexiones_servicio: Array<object>
    tipos_alumbrado: Array<object>
    otros_servicios: Array<object>

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.situaciones_vivienda = [
            { id: 1, nombre: 'PROPIA' },
            { id: 2, nombre: 'PROPIA, COMPRÁNDOLA A PLAZOS' },
            { id: 3, nombre: 'ALQUILADA' },
            { id: 4, nombre: 'ANTICRESIS' },
            { id: 5, nombre: 'CEDIDA POR OTRO HOGAR' },
            { id: 6, nombre: 'ALOJADO' },
            { id: 7, nombre: 'OTRO' },
        ]

        this.pisos_vivienda = [
            { id: 1, nombre: 'UN PISO' },
            { id: 2, nombre: 'DOS PISOS' },
            { id: 3, nombre: 'TRES PISOS' },
            { id: 4, nombre: 'CUATRO PISOS' },
            { id: 5, nombre: 'MÁS DE CUATRO PISOS' },
        ]

        this.estados_vivienda = [
            { id: 1, nombre: 'TOTALMENTE CONSTRUIDA' },
            { id: 2, nombre: 'EN CONSTRUCCIÓN' },
            { id: 3, nombre: 'VIVIENDA IMPROVISADA' },
            { id: 4, nombre: 'OTRO' },
        ]

        this.materiales_paredes_vivienda = [
            { id: 1, nombre: 'LADRILLO REVESTIDO' },
            { id: 2, nombre: 'LADRILLO NO REVESTIDO' },
            { id: 3, nombre: 'BLOQUETA DE CEMENTO REVESTIDO' },
            { id: 4, nombre: 'BLOQUETA DE CEMENTO NO REVESTIDO' },
            { id: 5, nombre: 'ADOBE' },
            { id: 6, nombre: 'QUINCHA (CAÑA CON BARRO)' },
            { id: 7, nombre: 'MADERA' },
            { id: 8, nombre: 'ESTERA' },
            { id: 9, nombre: 'OTRO' },
        ]

        this.materiales_pisos_vivienda = [
            { id: 1, nombre: 'PARQUET O MADERA PULIDA' },
            { id: 2, nombre: 'VINÍLICOS O SIMILARES' },
            { id: 3, nombre: 'LOSETAS' },
            { id: 4, nombre: 'CEMENTO' },
            { id: 5, nombre: 'TIERRA' },
            { id: 6, nombre: 'OTRO' },
        ]

        this.materiales_techos_vivienda = [
            { id: 1, nombre: 'CONCRETO ARMADO' },
            { id: 2, nombre: 'CALAMINA' },
            { id: 3, nombre: 'FIBRA DE CEMENTO' },
            { id: 4, nombre: 'ESTERA' },
            { id: 5, nombre: 'OTRO' },
        ]

        this.suministros_agua = [
            { id: 1, nombre: 'RED PÚBLICA DENTRO DE LA VIVIENDA' },
            {
                id: 2,
                nombre: 'RED PÚBLICA FUERA DE LA VIVIENDA, PERO DENTRO DEL EDIFICIO',
            },
            { id: 3, nombre: 'PILÓN DE USO PÚBLICO' },
            { id: 4, nombre: 'CAMIÓN - CISTERNA U OTRO SIMILAR' },
            { id: 5, nombre: 'RÍO, ACEQUIA, MANANTIAL O SIMILAR' },
            { id: 6, nombre: 'OTRO' },
        ]

        this.conexiones_servicio = [
            { id: 1, nombre: 'RED PÚBLICA DE DESAGÜE' },
            { id: 2, nombre: 'LETRINA O SILO' },
            { id: 3, nombre: 'OTRO' },
        ]

        this.tipos_alumbrado = [
            { id: 1, nombre: 'ELECTRICIDAD' },
            { id: 2, nombre: 'MECHERO' },
            { id: 3, nombre: 'VELA' },
            { id: 4, nombre: 'PANEL SOLAR' },
            { id: 5, nombre: 'OTRO' },
        ]

        this.otros_servicios = [
            { id: 1, nombre: 'EQUIPO DE SONIDO' },
            { id: 2, nombre: 'TELEVISOR' },
            { id: 3, nombre: 'SERVICIO DE CABLE' },
            { id: 4, nombre: 'REFRIGERADORA / CONGELADORA' },
            { id: 5, nombre: 'COCINA A GAS' },
            { id: 6, nombre: 'TELEFONO FIJO' },
            { id: 7, nombre: 'CELULAR' },
            { id: 8, nombre: 'COMPUTADORA (PC)' },
            { id: 9, nombre: 'LAPTOP' },
            {
                id: 10,
                nombre: 'SERVICIO DE INTERNET (PAQUETES DE DATOS PREPAGO Y POSTPAGO NO CUENTAN COMO SERVICIO DE INTERNET)',
            },
            { id: 11, nombre: 'TABLET' },
            { id: 12, nombre: 'AUTOMÓVIL / CAMINETA' },
            { id: 13, nombre: 'MOTO / MOTOTAXI' },
            { id: 14, nombre: 'OTRO' },
        ]

        try {
            this.form = this.fb.group({
                iPersId: [null, null],
            })
        } catch (error) {
            console.log(error, 'error inicializando formulario')
        }
    }

    guardarDatos() {
        console.log(this.form.value)
    }

    actualizarDatos() {
        console.log(this.form.value)
    }
}
