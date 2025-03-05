import { Component, Inject } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogContent,
    MatDialogTitle
} from '@angular/material/dialog';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { EnvironmentalLayer } from '../../types/environmental-layer';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-indicator-settings-modal',
    standalone: true,
    imports: [
        MatDialogContent,
        MatCheckbox,
        MatDialogTitle,
        FormsModule,
        MatIcon
    ],
    templateUrl: './indicator-settings-modal.component.html',
    styleUrl: './indicator-settings-modal.component.css'
})
export class IndicatorSettingsModalComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public layers: EnvironmentalLayer[],
    ) { }

    public toggleLayer(layer: EnvironmentalLayer): void {
        layer.isExpanded = !layer.isExpanded;
    }
}
