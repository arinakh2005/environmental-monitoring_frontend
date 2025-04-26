import { EnvironmentalProtectionMeasuresComponent } from './components/environmental-protection-measures/environmental-protection-measures.component';
import { HomeComponent } from './components/home/home.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'protection-measures', component: EnvironmentalProtectionMeasuresComponent },
    { path: 'home', component: HomeComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
];
