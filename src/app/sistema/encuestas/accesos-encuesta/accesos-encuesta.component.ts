import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnInit,
    OnChanges,
    SimpleChanges,
} from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { TiposAccesoService } from '../services/tipos-acceso.service'
import { MessageService, SelectItem } from 'primeng/api'
import { FormBuilder, FormGroup } from '@angular/forms'
import { EncuestasService } from '../services/encuestas.services'

@Component({
    selector: 'app-accesos-encuesta',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './accesos-encuesta.component.html',
    styleUrl: './accesos-encuesta.component.scss',
})
export class AccesosEncuestaComponent implements OnInit, OnChanges {
    //searchValue: string = ''
    @Input() visible: boolean = false
    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() mostrarDialogoAccesosEncuesta = new EventEmitter<void>()
    @Input() encuesta: any = null
    form: FormGroup
    propietario: any
    dataTiposAcceso: SelectItem[] = []

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private encuestasService: EncuestasService,
        private tiposAccesoService: TiposAccesoService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (this.encuesta != null && changes['encuesta']) {
            this.form.patchValue({
                iEspDremoTipoAccesoId: this.encuesta.iEspDremoTipoAccesoId,
                iEspUgelTipoAccesoId: this.encuesta.iEspUgelTipoAccesoId,
                iDirectorTipoAccesoId: this.encuesta.iDirectorTipoAccesoId,
            })
        }
    }

    // Datos de administradores

    /*administradores = [
        {
            id: 1,
            nombre: 'María del Pilar Laura Ramírez Chipana',
            rol: 'Propietario',
            avatar: 'assets/images/avatar1.jpg',
            iniciales: 'MP',
        },
        {
            id: 2,
            nombre: 'Julio Cesar Perez Sanchez',
            rol: 'Editor',
            avatar: 'assets/images/avatar2.jpg',
            iniciales: 'JC',
        },
    ]*/

    // Opciones para los dropdowns de roles
    /*rolesOptions = [
        { label: 'Propietario', value: 'propietario' },
        { label: 'Editor', value: 'editor' },
        { label: 'Viewer', value: 'viewer' },
    ]*/

    // Opciones para acceso a resultados
    /*accesoOptions = [
        { label: 'Detalle', value: 'detalle' },
        { label: 'Resumen', value: 'resumen' },
        { label: 'Completo', value: 'completo' },
        { label: 'Ninguno', value: 'ninguno' },
    ]*/

    // Valores seleccionados para acceso a resultados
    /*accesoResultados = {
        especialistasDREMO: 'detalle',
        especialistasUGEL: 'resumen',
        directores: 'ninguno',
    }*/

    // Valores seleccionados para roles de administradores
    /*selectedRoles = {
        1: 'propietario', // María del Pilar
        2: 'editor', // Julio Cesar
    }*/

    ngOnInit() {
        //console.log('ngOnInit AccesoEncuestaComponent')
        this.obtenerTiposAcceso()
        this.form = this.fb.group({
            iEspDremoTipoAccesoId: [''],
            iEspUgelTipoAccesoId: [''],
            iDirectorTipoAccesoId: [''],
        })
    }

    actualizarAccesos() {
        this.encuestasService
            .actualizarAccesosEncuesta(this.encuesta.iConfEncId, this.form)
            .subscribe({
                next: (resp: any) => {
                    this.encuesta.iEspDremoTipoAccesoId = this.form.get(
                        'iEspDremoTipoAccesoId'
                    )?.value
                    this.encuesta.iEspUgelTipoAccesoId = this.form.get(
                        'iEspUgelTipoAccesoId'
                    )?.value
                    this.encuesta.iDirectorTipoAccesoId = this.form.get(
                        'iDirectorTipoAccesoId'
                    )?.value
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Accesos actualizados',
                        detail: resp.message,
                    })
                    this.onHide()
                },
                error: (error) => {
                    console.error('Error al actualizar accesos:', error)
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                    })
                },
            })
    }

    obtenerTiposAcceso() {
        this.tiposAccesoService.obtenerTiposAcceso().subscribe({
            next: (resp: any) => {
                this.dataTiposAcceso = resp.data.map((item: any) => ({
                    label: item.cDescripcionAcceso,
                    value: item.iTipoAccesoId,
                }))
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error.message,
                })
            },
        })
    }

    onHide() {
        this.visible = false
        this.visibleChange.emit(this.visible)
    }

    /*onSearch() {
        console.log('Buscar:', this.searchValue)
        // Aquí puedes implementar la lógica de búsqueda
    }

    onRoleChange(userId: number, newRole: string) {
        this.selectedRoles[userId] = newRole
        console.log(`Usuario ${userId} cambió rol a: ${newRole}`)
    }

    onAccesoChange(tipo: string, valor: string) {
        this.accesoResultados[tipo] = valor
        console.log(`Acceso ${tipo} cambió a: ${valor}`)
    }

    finalizar() {
        console.log('Finalizando configuración...')
        console.log('Roles seleccionados:', this.selectedRoles)
        console.log('Acceso a resultados:', this.accesoResultados)
    }

    // Método para obtener las iniciales si no hay avatar
    getInitials(nombre: string): string {
        return nombre
            .split(' ')
            .map((word) => word.charAt(0))
            .join('')
            .substring(0, 2)
            .toUpperCase()
    }

    */
}
