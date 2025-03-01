import { Component, Input } from '@angular/core';
import { EnvironmentalFacility } from '../../types/environmental-facility';

@Component({
    selector: 'app-facility-summary',
    standalone: true,
    imports: [],
    templateUrl: './facility-summary.component.html',
    styleUrl: './facility-summary.component.css'
})
export class FacilitySummaryComponent {
    @Input() facility: EnvironmentalFacility | null = null;
}
