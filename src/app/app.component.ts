import { Component, OnDestroy, OnInit } from '@angular/core';
import { EnvironmentalMapComponent } from './components/environmental-map/environmental-map.component';
import { MatButtonModule, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { UpsertIndicatorModalComponent } from './components/upsert-indicator-modal/upsert-indicator-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { EnvironmentalLayer } from './types/environmental-layer';
import { EnvironmentalSubsystem } from './enums/environmental-subsystem';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { EnvironmentalFacility } from './types/environmental-facility';
import { EnvironmentalFacilitiesService } from './services/environmental-facilities.service';
import { Subscription } from 'rxjs';
import { markerColors } from './constants/constants';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        EnvironmentalMapComponent,
        MatIcon,
        MatMiniFabButton,
        MatSidenavContainer,
        MatToolbar,
        MatSidenav,
        MatIconButton,
        MatButtonModule,
        FormsModule,
        MatSidenavContent,
        MatMenu,
        MatMenuItem,
        MatMenuTrigger,
        CommonModule,
    ],
    providers: [EnvironmentalFacilitiesService],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
    public layers: EnvironmentalLayer[] = [
        { key: EnvironmentalSubsystem.AirQuality, label: 'Якість повітря', isSelected: false },
        { key: EnvironmentalSubsystem.Radiation, label: 'Радіація', isSelected: false },
        { key: EnvironmentalSubsystem.CoastalWater, label: 'Прибережні води', isSelected: false },
        { key: EnvironmentalSubsystem.Biodiversity, label: 'Біорізноманіття', isSelected: false },
    ];
    public environmentalFacilities: EnvironmentalFacility[] = [];
    public isSidenavOpened: boolean = true;
    public markerColors: Map<EnvironmentalSubsystem, string> = markerColors;

    private _subscriptions: Subscription[] = [];

    constructor(
        private readonly dialog: MatDialog,
        private readonly facilityService: EnvironmentalFacilitiesService,
    ) { }

    public ngOnInit() {
        this.loadFacilities();
    }

    public ngOnDestroy() {
        this._subscriptions.forEach((subscription) => subscription.unsubscribe());
    }

    public openIndicatorDialog(): void {
        this.dialog.open(UpsertIndicatorModalComponent, {
            data: { },
            minWidth: '300px',
            width: '400px',
        });
    }

    public toggleSidenav(): void {
        this.isSidenavOpened = !this.isSidenavOpened;
    }

    public toggleLayer(layer: EnvironmentalLayer) {
        layer.isSelected = !layer.isSelected;
        this.loadFacilities();
    }

    private loadFacilities(): void {
        const selectedFilters = this.layers
            .filter((layer: EnvironmentalLayer) => layer.isSelected)
            .map((layer) => layer.key);

        this._subscriptions.push(this.facilityService.getAll(selectedFilters).subscribe((data) => {
            this.environmentalFacilities = data;
        }));
    }
}
