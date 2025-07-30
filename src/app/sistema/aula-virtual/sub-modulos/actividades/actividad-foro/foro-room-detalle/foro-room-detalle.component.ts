import { PrimengModule } from '@/app/primeng.module';
import { IconComponent } from '@/app/shared/icon/icon.component';
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component';
import { Component, Input, OnInit } from '@angular/core';
import { ForoComentariosComponent } from '../foro-comentarios/foro-comentarios.component';
import { tipoActividadesKeys } from '@/app/sistema/aula-virtual/interfaces/actividad.interface';

@Component({
  selector: 'app-foro-room-detalle',
  standalone: true,
  templateUrl: './foro-room-detalle.component.html',
  styleUrls: ['./foro-room-detalle.component.scss'],
  imports: [PrimengModule, ToolbarPrimengComponent, IconComponent, ForoComentariosComponent],
})
export class ForoRoomDetalleComponent implements OnInit {
  @Input() dataForo: any[];
  @Input() ixActivadadId: string;
  @Input() iActTopId: tipoActividadesKeys;
  @Input() iIeCursoId;
  @Input() iSeccionId;
  @Input() iNivelGradoId;

  foro: any; // variable con datos generales de foro
  idForo: number; // variable para enviar el idForo a otro componente

  constructor() {}

  ngOnInit() {
    this.foro = this.dataForo;
    this.idForo = this.foro.iForoId;
  }
}
