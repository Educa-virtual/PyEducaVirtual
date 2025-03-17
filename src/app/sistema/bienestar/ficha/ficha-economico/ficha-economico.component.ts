import { PrimengModule } from '@/app/primeng.module'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { CompartirFichaService } from '../../services/compartir-ficha.service'
import { Router } from '@angular/router'

@Component({
    selector: 'app-ficha-economico',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './ficha-economico.component.html',
    styleUrl: './ficha-economico.component.scss',
})
export class FichaEconomicoComponent implements OnInit {
    formEconomico: FormGroup
    familiares: Array<object>
    modalidades: Array<object>
    tipos_jornadas: Array<object>
    percibe: Array<object>
    tipos_apoyos: Array<object>

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private compartirFichaService: CompartirFichaService
    ) {
        if (this.compartirFichaService.getiFichaDGId() === null) {
            this.router.navigate(['/bienestar/ficha/general'])
        }
    }

    ngOnInit(): void {
        this.familiares = [
            {
                id: 1,
                documento: '70024345',
                nomape: 'Edwin Ricardo Jimenez Sanchez',
                modalidad_id: 1,
                modalidad_nombre: 'DEPENDIENTE',
                tipo_jornada_id: 1,
                tipo_jornada_nombre: 'COMPLETA',
                ingreso_bruto: 1500,
            },
            {
                id: 2,
                documento: '71343465',
                nomape: 'Maria Luisa Castillo Molina',
                modalidad_id: 2,
                modalidad_nombre: 'INDEPENDIENETE',
                tipo_jornada_id: 2,
                tipo_jornada_nombre: 'PARCIAL',
                ingreso_bruto: 1000,
            },
        ]

        this.modalidades = [
            { value: 1, label: 'DEPENDIENTE' },
            { value: 2, label: 'INDEPENDIENTE' },
        ]

        this.tipos_jornadas = [
            { value: 1, label: 'COMPLETA' },
            { value: 2, label: 'PARCIAL' },
        ]

        this.percibe = [
            { value: 1, label: 'SI' },
            { value: 2, label: 'NO' },
        ]

        this.tipos_apoyos = [
            { value: 1, label: 'DEPENDIENTE' },
            { value: 2, label: 'INDEPENDIENTE' },
        ]

        try {
            this.formEconomico = this.fb.group({
                iPersId: [null, null],
            })
        } catch (error) {
            console.log(error, 'error inicializando formulario')
        }
    }

    guardarDatos() {
        console.log(this.formEconomico.value)
    }

    actualizarDatos() {
        console.log(this.formEconomico.value)
    }

    editarFila(familiar: any) {
        console.log(familiar, 'familiar')
    }

    guardarFila(familiar: any) {
        console.log(familiar, 'familiar')
    }

    cancelarEdicionFila(familiar: any, ri: number) {
        console.log(familiar, ri, 'familiar')
    }
}
