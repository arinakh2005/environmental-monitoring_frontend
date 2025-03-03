import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { environmentalSubsystemColors } from './constants/constants';
import { CommonModule } from '@angular/common';
import {
    EnvironmentalIndicatorChartComponent
} from './components/environmental-indicator-chart/environmental-indicator-chart.component';
import { EnvironmentalFacilityIndicator } from './types/environmental-facility-indicator';

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
        EnvironmentalIndicatorChartComponent,
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
    public selectedFacility: EnvironmentalFacility | null = null;
    public selectedFacilityIndicator: EnvironmentalFacilityIndicator | null = null;
    public isSidenavOpened: boolean = true;
    public environmentalSubsystemColors: Map<EnvironmentalSubsystem, string> = environmentalSubsystemColors;

    private _subscriptions: Subscription[] = [];

    @ViewChild('indicatorChartBlockRef', { static: false }) indicatorChartBlockRef!: ElementRef;

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

    public onSelectFacility(facility: EnvironmentalFacility | null) {
        this.selectedFacility = facility;
    }

    public onSelectFacilityIndicator(facilityIndicator: EnvironmentalFacilityIndicator | null) {
        this.selectedFacilityIndicator = facilityIndicator;
        setTimeout(() => {
            if (this.indicatorChartBlockRef) {
                this.indicatorChartBlockRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
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
