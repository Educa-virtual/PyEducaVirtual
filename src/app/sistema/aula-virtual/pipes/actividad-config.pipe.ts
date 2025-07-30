import { inject, Pipe, type PipeTransform } from '@angular/core';
import { actividadesConfig } from '../constants/aula-virtual';
import { IActividad } from '../interfaces/actividad.interface';
import { ConstantesService } from '@/app/servicios/constantes.service';

@Pipe({
  name: 'appActividadConfig',
  standalone: true,
})
export class ActividadConfigPipe implements PipeTransform {
  private _ConstantesService = inject(ConstantesService);

  transform(iActTipoId: number, tipo: string, row?: IActividad): any {
    const config = actividadesConfig[iActTipoId];
    if (!config) return null;

    if (tipo === 'acciones') {
      const iPerfilId = this._ConstantesService.iPerfilId;
      return (
        config.acciones?.filter(accion => {
          if (typeof accion.isVisible === 'function') {
            return accion.isVisible(row, iPerfilId);
          }
          return true;
        }) ?? []
      );
    }

    return config[tipo];
  }
}
