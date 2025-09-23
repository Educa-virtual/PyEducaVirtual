import { PrimengModule } from '@/app/primeng.module';
import { ConstantesService } from '@/app/servicios/constantes.service';
import { PerfilComponent } from '@/app/sistema/docente/perfil/perfil.component';
import { CambiarConstrasenaComponent } from '@/app/sistema/usuarios/cambiar-constrasena/cambiar-constrasena.component';
import { environment } from '@/environments/environment';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [PrimengModule, PerfilComponent, CambiarConstrasenaComponent],
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.scss',
})
export class UserAccountComponent implements OnInit {
  @Output() actionTopBar = new EventEmitter();

  @Input() modulos = [];
  @Input() roles = [];
  @Input() selectedPerfil;
  @Input() selectedModulo: string; //perfil seleccionado

  name: string;
  fotografia: string;
  showModalDatosPersonales: boolean = false;
  showModalChangePassword: boolean = false;

  constructor(private ConstantesService: ConstantesService) {
    this.name = this.ConstantesService.nombres;
    this.fotografia = environment.backend + '/' + this.ConstantesService.fotografia;
  }

  items: MenuItem[] | undefined;
  ngOnInit() {
    this.items = [
      {
        items: [
          {
            label: 'Mis datos personales',
            icon: 'pi pi-user',
            command: () => {
              this.showModalDatosPersonales = true;
            },
          },
          {
            label: 'Cambiar contraseña',
            icon: 'pi pi-lock',
            command: () => {
              this.showModalChangePassword = true;
            },
          },
          {
            label: 'Cerrar sesión',
            icon: 'pi pi-sign-out',
            command: () => {
              this.actionTopBar.emit({ accion: 'logout' });
            },
          },
        ],
      },
    ];
  }

  changePerfil() {
    const data = {
      accion: 'modulo',
      item: this.modulos.find(item => item.iModuloId === this.selectedModulo),
    };
    this.actionTopBar.emit(data);
  }
}
