import { EnvironmentalSubsystem } from '../enums/environmental-subsystem';

export type EnvironmentalIndicator = {
    id?: string | number,
    name: string,
    subsystemType: EnvironmentalSubsystem,
}
