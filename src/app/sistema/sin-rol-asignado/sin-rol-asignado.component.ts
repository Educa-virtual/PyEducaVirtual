import { Component, EventEmitter, Input, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PrimengModule } from '@/app/primeng.module'
/* import { FormPerfilesComponent } from '../../shared/components/form-perfiles/form-perfiles.component'; // Ajusta la ruta
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { TokenStorageService } from '@/app/servicios/token.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { Router } from '@angular/router'; */
//import { EventEmitter } from 'ws';
//import { input } from '@angular/core';

@Component({
    selector: 'app-sin-rol-asignado',
    standalone: true,
    imports: [CommonModule, PrimengModule],
    templateUrl: './sin-rol-asignado.component.html',
    styleUrl: './sin-rol-asignado.component.scss',
})
export class SinRolAsignadoComponent {
    username: string = ''
    showContactModal: boolean = true
    user: any = null

    /* constructor(
    private store: LocalStoreService,
    private tokenStorageService: TokenStorageService,
    private constantesService: ConstantesService,
    private router: Router
  ) {} */

    /* ngOnInit(): void {
    // Verificar si el usuario está autenticado
    const user = this.store.getItem('dremoUser');
    if (!user) {
      this.logout();
      return;
    }

    this.user = user;
    this.username = user.nombres || user.nombre || user.username || 'Usuario';

    // Verificar si el usuario tiene perfiles
    if (user.perfiles && user.perfiles.length > 0) {
      // Si tiene perfiles pero aún no ha seleccionado uno, mostrarle el modal de selección
      const perfilSeleccionado = this.store.getItem('dremoPerfil');
      if (perfilSeleccionado) {
        // Si ya tiene un perfil seleccionado, redirigir al inicio
        this.router.navigate(['/']);
      }
      // Si no tiene perfil seleccionado, el modal de selección se mostrará
    }
  } */

    /* handleModalAction(event: any): void {
    if (event.accion === 'close-modal') {
      this.showContactModal = false;
    }
  }  */

    /* logout(): void {
    this.store.clear();
    this.tokenStorageService.signOut();
    this.router.navigate(['/login']);
  } */

    @Input() visible: boolean = false
    @Output() visibleChange = new EventEmitter<boolean>()

    cerrarModal() {
        this.visible = false
        this.visibleChange.emit(false)
    }
}
