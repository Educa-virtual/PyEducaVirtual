import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'

@Component({
    selector: 'app-acceso-encuesta',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './acceso-encuesta.component.html',
    styleUrl: './acceso-encuesta.component.scss',
})
export class AccesoEncuestaComponent implements OnInit {
    searchValue: string = ''
    @Input() visible: boolean = false
    @Output() visibleChange = new EventEmitter<boolean>()
    @Output() mostrarDialogoAccesoEncuesta = new EventEmitter<void>()

    // Datos de administradores
    administradores = [
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
    ]

    // Opciones para los dropdowns de roles
    rolesOptions = [
        { label: 'Propietario', value: 'propietario' },
        { label: 'Editor', value: 'editor' },
        { label: 'Viewer', value: 'viewer' },
    ]

    // Opciones para acceso a resultados
    accesoOptions = [
        { label: 'Detalle', value: 'detalle' },
        { label: 'Resumen', value: 'resumen' },
        { label: 'Completo', value: 'completo' },
        { label: 'Ninguno', value: 'ninguno' },
    ]

    // Valores seleccionados para acceso a resultados
    accesoResultados = {
        especialistasDREMO: 'detalle',
        especialistasUGEL: 'resumen',
        directores: 'ninguno',
    }

    // Valores seleccionados para roles de administradores
    selectedRoles = {
        1: 'propietario', // María del Pilar
        2: 'editor', // Julio Cesar
    }

    ngOnInit() {
        console.log('ngOnInit AccesoEncuestaComponent')
    }
    onSearch() {
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

    onHide() {
        this.visible = false
        this.visibleChange.emit(this.visible)
    }
}
