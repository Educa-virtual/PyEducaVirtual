import { Injectable } from '@angular/core'
import {
    ActivatedRoute,
    ActivatedRouteSnapshot,
    Router,
    RoutesRecognized,
} from '@angular/router'
import { filter, map, tap } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { Breadcrumb } from './breadcrumb.model'

@Injectable()
export class BreadcrumbNavService {
    public crumbs$: Observable<Breadcrumb[]>
    public activeCrumb: Breadcrumb

    constructor(
        public activatedRoute: ActivatedRoute,
        public router: Router
    ) {
        this.crumbs$ = this.router.events.pipe(
            // only continue if routing has completed
            filter((event) => event instanceof RoutesRecognized),

            map((event: RoutesRecognized) => event.state.root.firstChild),

            map((snapshot) => this.routeSnapshotToBreadcrumb(snapshot)),

            tap((crumbs) => (this.activeCrumb = crumbs[crumbs.length - 1]))
        )
    }

    private routeSnapshotToBreadcrumb(snapshot: ActivatedRouteSnapshot): any[] {
        const crumbs: Breadcrumb[] = []
        let routeSnapshot = snapshot
        let routeFromRoot = ''

        while (routeSnapshot) {
            if (!routeSnapshot.url.length) {
                break
            }

            const urlSegment = routeSnapshot.url[0].path
            const route = (routeFromRoot += `/${urlSegment}`)
            const label = routeSnapshot.data['breadcrumb']
            crumbs.push({
                urlSegment,
                route,
                label,
            })

            routeSnapshot = routeSnapshot.firstChild
        }

        return crumbs
    }
}
