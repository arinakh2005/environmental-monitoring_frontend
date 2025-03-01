import { EnvironmentalSubsystem } from '../enums/environmental-subsystem';

export const markerColors: Map<EnvironmentalSubsystem, string> = new Map([
    [EnvironmentalSubsystem.AirQuality, '#da91ff'],
    [EnvironmentalSubsystem.CoastalWater, '#809fff'],
    [EnvironmentalSubsystem.Biodiversity, '#80ff80'],
    [EnvironmentalSubsystem.Radiation, '#ffe380'],
]);
