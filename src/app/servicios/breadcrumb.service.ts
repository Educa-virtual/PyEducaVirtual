import { Injectable } from '@angular/core'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { BehaviorSubject } from 'rxjs'
import { filter } from 'rxjs/operators'

@Injectable({
    providedIn: 'root',
})
export class BreadcrumbService {
    private breadcrumbsSubject = new BehaviorSubject<any[]>([])
    breadcrumbs$ = this.breadcrumbsSubject.asObservable()

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {
                this.breadcrumbsSubject.next(
                    this.createBreadcrumbs(this.activatedRoute.root)
                )
            })
    }

    private createBreadcrumbs(
        route: ActivatedRoute,
        url: string = '',
        breadcrumbs: any[] = []
    ): any[] {
        const children: ActivatedRoute[] = route.children

        if (children.length === 0) {
            return breadcrumbs
        }

        for (const child of children) {
            const routeURL: string = child.snapshot.url
                .map((segment) => segment.path)
                .join('/')
            if (routeURL !== '') {
                url += `/${routeURL}`
                const breadcrumb = child.snapshot.data['breadcrumb']
                breadcrumbs.push({ label: breadcrumb, url: url })

                // Si hay parámetros, los agregamos a la URL
                if (child.snapshot.params) {
                    Object.keys(child.snapshot.params).forEach((param) => {
                        const paramValue = child.snapshot.params[param]
                        url += `/${paramValue}`
                        breadcrumbs[breadcrumbs.length - 1].label +=
                            `:${param}=${paramValue}`
                    })
                }
            }
            return this.createBreadcrumbs(child, url, breadcrumbs)
        }
        return breadcrumbs
    }
}
