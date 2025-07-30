import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '@/app/primeng.module';
import { LocalStoreService } from '@/app/servicios/local-store.service';
import { TokenStorageService } from '@/app/servicios/token.service';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sin-rol-asignado',
  standalone: true,
  imports: [CommonModule, PrimengModule],
  templateUrl: './sin-rol-asignado.component.html',
  styleUrl: './sin-rol-asignado.component.scss',
})
export class SinRolAsignadoComponent implements OnInit {
  correoTitle: string = 'educacion_virtual@gremoquegua.edu.pe';
  username: string = '';
  //name: string
  //name1: string
  user: any = null;
  // Para el modal propio del componente
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  constructor(
    private store: LocalStoreService,
    private tokenStorageService: TokenStorageService,
    private constantesService: ConstantesService,
    private router: Router
  ) {
    this.user = this.constantesService.nombres;
    this.username = this.constantesService.nombre;
  }

  ngOnInit(): void {
    // Verificar si el usuario está autenticado
    const user = this.store.getItem('dremoUser');
    if (!user) {
      this.logout();
      return;
    }

    this.user = user;
    this.username = user.nombres || user.nombre || user.username || 'Usuario';

    // mostrar automaticamente el dialog
    this.visible = true;
    // si el usuario tiene perfiles, redirigir
    if (user.perfiles && user.perfiles.length > 0) {
      this.router.navigate(['/']);
    }
  }

  logout(): void {
    // Limpiar el almacenamiento
    this.store.clear();
    this.tokenStorageService.signOut();

    // Reiniciar todas las variables relevantes
    this.visible = false;
    this.visibleChange.emit(false);

    // Navegar al login
    this.router.navigate(['/login']);
  }
  /*cerrarModal() {
        this.visible = false
        this.visibleChange.emit(false)
    }*/
}
