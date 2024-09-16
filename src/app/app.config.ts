import { LocationStrategy, PathLocationStrategy } from '@angular/common'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { ApplicationConfig, importProvidersFrom } from '@angular/core'
import { MessageService } from 'primeng/api'
import { ToastModule } from 'primeng/toast'
import { CountryService } from './demo/service/country.service'
import { CustomerService } from './demo/service/customer.service'
import { EventService } from './demo/service/event.service'
import { IconService } from './demo/service/icon.service'
import { NodeService } from './demo/service/node.service'
import { PhotoService } from './demo/service/photo.service'
import { ProductService } from './demo/service/product.service'
import { AppLayoutModule } from './layout/app.layout.module'
import { PrimengModule } from './primeng.module'
import { ErrorInterceptor } from './shared/interceptors/error-interceptor/error-interceptor.interceptor'
import { GlobalLoaderInterceptor } from './shared/interceptors/global-loader/global-loader-interceptor/global-loader-interceptor.interceptor'
import {
    InMemoryScrollingFeature,
    InMemoryScrollingOptions,
    provideRouter,
    RouterConfigurationFeature,
    withInMemoryScrolling,
    withRouterConfig,
} from '@angular/router'

import {
    provideIcons,
    provideNgIconsConfig,
    withExceptionLogger,
} from '@ng-icons/core'

import { routes } from './app.routes'

const scrollConfig: InMemoryScrollingOptions = {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
}

const routerConfig: RouterConfigurationFeature = withRouterConfig({
    onSameUrlNavigation: 'reload',
})

const inMemoryScrollingFeature: InMemoryScrollingFeature =
    withInMemoryScrolling(scrollConfig)

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes, inMemoryScrollingFeature, routerConfig),
        provideNgIconsConfig(
            {
                size: '1.5em',
            },
            withExceptionLogger()
        ),
        provideIcons({}),
        importProvidersFrom(AppLayoutModule, PrimengModule, ToastModule),
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        CountryService,
        CustomerService,
        EventService,
        IconService,
        NodeService,
        PhotoService,
        MessageService,
        ProductService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: GlobalLoaderInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true,
        },
    ],
}
