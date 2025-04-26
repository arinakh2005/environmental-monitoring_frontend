import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EnvironmentalFacilitiesService } from '../../services/environmental-facilities.service';
import { EnvironmentalFacility } from '../../types/environmental-facility';
import { EnvironmentalFacilityIndicator } from '../../types/environmental-facility-indicator';
import { EnvironmentalIndicatorChartComponent } from '../environmental-indicator-chart/environmental-indicator-chart.component';
import { EnvironmentalIndicatorsService } from '../../services/environmental-indicators.service';
import { EnvironmentalLayer } from '../../types/environmental-layer';
import { EnvironmentalMapComponent } from '../environmental-map/environmental-map.component';
import { EnvironmentalSubsystem } from '../../enums/environmental-subsystem';
import { FormsModule } from '@angular/forms';
import { IndicatorSettingsModalComponent } from '../indicator-settings-modal/indicator-settings-modal.component';
import { MatButtonModule, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { UpsertIndicatorModalComponent } from '../upsert-indicator-modal/upsert-indicator-modal.component';
import { environmentalSubsystemColors } from '../../constants/constants';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        EnvironmentalIndicatorChartComponent,
        EnvironmentalMapComponent,
        FormsModule,
        MatButtonModule,
        MatIcon,
        MatIconButton,
        MatMenu,
        MatMenuItem,
        MatMenuTrigger,
        MatMiniFabButton,
        MatSidenav,
        MatSidenavContainer,
        MatSidenavContent,
        MatToolbar,
        MatTooltip,
        RouterLink,
    ],
    providers: [
        EnvironmentalFacilitiesService,
        EnvironmentalIndicatorsService,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
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
        private readonly facilitiesService: EnvironmentalFacilitiesService,
        private readonly indicatorsService: EnvironmentalIndicatorsService,
    ) { }

    public ngOnInit() {
        this.loadFacilities();
        this.loadIndicators();
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

    public openSettingsDialog(): void {
        const dialogRef = this.dialog.open(IndicatorSettingsModalComponent, {
            width: '400px',
            data: this.layers,
        });

        dialogRef.afterClosed().subscribe((updatedIndicators) => {
            if (updatedIndicators) {
                this.layers = updatedIndicators;
            }
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

        this._subscriptions.push(this.facilitiesService.getAll(selectedFilters).subscribe((data) => {
            this.environmentalFacilities = data;
        }));
    }

    private loadIndicators(): void {
        this._subscriptions.push(this.indicatorsService.getIndicators().subscribe((data) => {
            this.layers.map((layer) => {
                layer.indicators = data.filter((indicator) => indicator.subsystemType === layer.key);
                layer.indicators.forEach((indicator) => { indicator.isVisible = true });
            });
        }));
    }
}
