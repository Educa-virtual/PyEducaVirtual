import { Injectable } from '@angular/core'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { BehaviorSubject } from 'rxjs'
import { filter } from 'rxjs/operators'
@Injectable({
    providedIn: 'root',
})
export class BreadcrumbService {
    private breadcrumbsSubject: BehaviorSubject<
        Array<{ label: string; url: string }>
    > = new BehaviorSubject([])
    breadcrumbs$ = this.breadcrumbsSubject.asObservable()

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {
                const breadcrumbs = this.createBreadcrumbs(
                    this.activatedRoute.root
                )
                this.breadcrumbsSubject.next(breadcrumbs)
            })
    }

    private createBreadcrumbs(
        route: ActivatedRoute,
        url: string = '',
        breadcrumbs: Array<{
            label: string
            url: string
            icon: string
            route: boolean
            index: number
        }> = []
    ): Array<{ label: string; url: string }> {
        const children: ActivatedRoute[] = route.children

        // Si no tiene rutas hijas, devolvemos los breadcrumbs
        if (children.length === 0) {
            return breadcrumbs
        }
        children.forEach((child, index) => {
            const routeURL: string = child.snapshot.url
                .map((segment) => segment.path)
                .join('/')
            const breadcrumbLabel =
                child.snapshot.data['breadcrumb'] || routeURL // Si no existe el 'breadcrumb', usamos el nombre de la ruta
            const breadcrumbIcon = child.snapshot.data['icon'] || 'pi pi-home'
            if (routeURL !== '') {
                url += `/${routeURL}`
                breadcrumbs.push({
                    label: breadcrumbLabel,
                    url: url,
                    icon: breadcrumbIcon,
                    route:
                        breadcrumbs.length === children.length ? true : false,
                    index: index,
                })
            }

            // // Recursividad: para cada hijo, seguir agregando al breadcrumb
            //return this.createBreadcrumbs(child, url, breadcrumbs);
        })

        return breadcrumbs
    }
}
