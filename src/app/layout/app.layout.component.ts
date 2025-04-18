import { Component, OnDestroy, Renderer2, ViewChild } from '@angular/core'
import { NavigationEnd, Router, RouterOutlet } from '@angular/router'
import { filter, Subscription } from 'rxjs'
import { LayoutService } from './service/app.layout.service'
import { AppSidebarComponent } from './app.sidebar.component'
import { AppTopBarComponent } from './toolbar/app.topbar.component'
import { NgClass } from '@angular/common'
import { AppConfigComponent } from './config/app.config.component'
import { GlobalLoaderComponent } from '../shared/interceptors/global-loader/global-loader.component'
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal/confirm-modal.component'
import { BreadcrumbPrimengComponent } from '../shared/breadcrumb-primeng/breadcrumb-primeng.component'

@Component({
    selector: 'app-layout',
    templateUrl: './app.layout.component.html',
    standalone: true,
    imports: [
        NgClass,
        AppTopBarComponent,
        AppSidebarComponent,
        RouterOutlet,
        AppConfigComponent,
        GlobalLoaderComponent,
        ConfirmModalComponent,
        BreadcrumbPrimengComponent,
    ],
})
export class AppLayoutComponent implements OnDestroy {
    overlayMenuOpenSubscription: Subscription

    menuOutsideClickListener

    profileMenuOutsideClickListener

    @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent

    @ViewChild(AppTopBarComponent) appTopbar!: AppTopBarComponent

    constructor(
        public layoutService: LayoutService,
        public renderer: Renderer2,
        public router: Router
    ) {
        this.overlayMenuOpenSubscription =
            this.layoutService.overlayOpen$.subscribe(() => {
                if (!this.menuOutsideClickListener) {
                    this.menuOutsideClickListener = this.renderer.listen(
                        'document',
                        'click',
                        (event) => {
                            const isOutsideClicked = !(
                                this.appSidebar.el.nativeElement.isSameNode(
                                    event.target
                                ) ||
                                this.appSidebar.el.nativeElement.contains(
                                    event.target
                                ) ||
                                this.appTopbar.menuButton.nativeElement.isSameNode(
                                    event.target
                                ) ||
                                this.appTopbar.menuButton.nativeElement.contains(
                                    event.target
                                )
                            )

                            if (isOutsideClicked) {
                                this.hideMenu()
                            }
                        }
                    )
                }

                if (!this.profileMenuOutsideClickListener) {
                    this.profileMenuOutsideClickListener = this.renderer.listen(
                        'document',
                        'click',
                        (event) => {
                            const isOutsideClicked = !(
                                this.appTopbar.menu?.nativeElement.isSameNode(
                                    event.target
                                ) ||
                                this.appTopbar.menu?.nativeElement.contains(
                                    event.target
                                )
                            )

                            if (isOutsideClicked) {
                                this.hideProfileMenu()
                            }
                        }
                    )
                }

                if (this.layoutService.state.staticMenuMobileActive) {
                    this.blockBodyScroll()
                }
            })

        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {
                this.hideMenu()
                this.hideProfileMenu()
            })
    }

    hideMenu() {
        this.layoutService.state.overlayMenuActive = false
        this.layoutService.state.staticMenuMobileActive = false
        this.layoutService.state.menuHoverActive = false
        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener()
            this.menuOutsideClickListener = null
        }
        this.unblockBodyScroll()
    }

    hideProfileMenu() {
        this.layoutService.state.profileSidebarVisible = false
        if (this.profileMenuOutsideClickListener) {
            this.profileMenuOutsideClickListener()
            this.profileMenuOutsideClickListener = null
        }
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll')
        } else {
            document.body.className += ' blocked-scroll'
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll')
        } else {
            document.body.className = document.body.className.replace(
                new RegExp(
                    '(^|\\b)' +
                        'blocked-scroll'.split(' ').join('|') +
                        '(\\b|$)',
                    'gi'
                ),
                ' '
            )
        }
    }

    get containerClass() {
        return {
            'layout-theme-light':
                this.layoutService.config().colorScheme === 'light',
            'layout-theme-dark':
                this.layoutService.config().colorScheme === 'dark',
            'layout-overlay':
                this.layoutService.config().menuMode === 'overlay',
            'layout-static': this.layoutService.config().menuMode === 'static',
            'layout-static-inactive':
                this.layoutService.state.staticMenuDesktopInactive &&
                this.layoutService.config().menuMode === 'static',
            // 'layout-static':
            //     this.layoutService.state.staticMenuDesktopInactive &&
            //     this.layoutService.config().menuMode === 'static',
            // 'layout-static-inactive':
            //     this.layoutService.state.staticMenuDesktopInactive &&
            //     !this.layoutService.state.staticMenuToggle &&
            //     this.layoutService.config().menuMode === 'static',
            // 'layout-static-toggle':
            //     this.layoutService.state.staticMenuDesktopInactive &&
            //     this.layoutService.state.staticMenuToggle &&
            //     this.layoutService.config().menuMode === 'static',
            'layout-overlay-active': this.layoutService.state.overlayMenuActive,
            'layout-mobile-active':
                this.layoutService.state.staticMenuMobileActive,
            // 'layout-mobile-inactive':
            //     this.layoutService.state.staticMenuMobileActive && !this.layoutService.state.staticMenuToggle &&
            //     this.layoutService.config().menuMode === 'static',
            // 'layout-mobile-toggle':
            //     this.layoutService.state.staticMenuMobileActive && this.layoutService.state.staticMenuToggle &&
            //     this.layoutService.config().menuMode === 'static',
            'p-input-filled':
                this.layoutService.config().inputStyle === 'filled',
            'p-ripple-disabled': !this.layoutService.config().ripple,
        }
    }

    ngOnDestroy() {
        if (this.overlayMenuOpenSubscription) {
            this.overlayMenuOpenSubscription.unsubscribe()
        }

        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener()
        }
    }
}
