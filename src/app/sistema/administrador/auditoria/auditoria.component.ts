import { Component, OnInit } from '@angular/core'
import { Router, NavigationEnd, RouterOutlet } from '@angular/router'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';


@Component({
    selector: 'app-auditoria',
    standalone: true,
    imports: [RouterOutlet, ContainerPageComponent],
    templateUrl: './auditoria.component.html',
    styleUrl: './auditoria.component.scss',
})
export class AuditoriaComponent implements OnInit {
  private routerSubscription: Subscription;

    actionsContainer = [
      {
          labelTooltip: 'Ver datos',
          text: 'Ver datos',
          icon: 'pi pi-plus',
          accion: 'crear',
          class: 'p-button-primary',
      },
  ]

    constructor(private router: Router) {}

    ngOnInit(): void {
      this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateActionsBasedOnRoute(event.urlAfterRedirects);
      });

      this.updateActionsBasedOnRoute(this.router.url);


    }

    ngOnDestroy(): void {
      // Limpiar la suscripción al destruir el componente
      if (this.routerSubscription) {
        this.routerSubscription.unsubscribe();
      }
    }
  

    private updateActionsBasedOnRoute(route: string): void {
      if (route === '/administrador/auditoria/panel-grafico') {
        this.actionsContainer = [
          {
            labelTooltip: 'Ver datos',
            text: 'Ver datos',
            icon: 'pi pi-plus',
            accion: 'crear',
            class: 'p-button-primary',
          },
        ];

        
      } else {
        this.actionsContainer = [
          {
            labelTooltip: 'Ver panel gráfico',
            text: 'Ver panel gráfico',
            icon: 'pi pi-plus',
            accion: 'crear',
            class: 'p-button-primary',
          },
        ];
      }
    }
  


}
