import { PrimengModule } from '@/app/primeng.module';
import { MostrarErrorComponent } from '@/app/shared/components/mostrar-error/mostrar-error.component';
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component';
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component';
import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-tipos-publico',
  standalone: true,
  imports: [PrimengModule, ToolbarPrimengComponent, TablePrimengComponent],
  templateUrl: './tipos-publico.component.html',
  styleUrl: './tipos-publico.component.scss',
})
export class TiposPublicoComponent extends MostrarErrorComponent implements OnInit {
  data = signal<any[]>([]);
  columnasTabla = signal<any[]>([]);
  accionesTabla = signal<any[]>([]);

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  accionBnt({ accion, item }: { accion: string; item?: any }): void {
    console.log(accion, item);
    // switch (accion) {
    // }
  }
}
