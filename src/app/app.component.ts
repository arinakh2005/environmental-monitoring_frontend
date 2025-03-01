import { Component } from '@angular/core';
import { EnvironmentalMapComponent } from './components/environmental-map/environmental-map.component';
import { MatButtonModule, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { UpsertIndicatorModalComponent } from './components/upsert-indicator-modal/upsert-indicator-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon} from '@angular/material/icon';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { EnvironmentalLayer } from './types/environmental-layer';
import { EnvironmentalSubsystem } from './enums/environmental-subsystem';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { DataService } from './services/data.service';

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
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent {
    public layers: EnvironmentalLayer[] = [
        { key: EnvironmentalSubsystem.AirQuality, label: 'Якість повітря', isSelected: false },
        { key: EnvironmentalSubsystem.Radiation, label: 'Радіація', isSelected: false },
        { key: EnvironmentalSubsystem.CoastalWater, label: 'Прибережні води', isSelected: false },
        { key: EnvironmentalSubsystem.Biodiversity, label: 'Біорізноманіття', isSelected: false }
    ];
    public isSidenavOpened: boolean = true;

    constructor(
        private readonly dialog: MatDialog,
        private readonly dataService: DataService,
    ) {
        this.dataService.fetchEnvironmentalFacilities();
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
}
