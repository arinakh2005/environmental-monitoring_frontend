import { EnvironmentalSubsystem } from '../enums/environmental-subsystem';

export const environmentalSubsystemColors: Map<EnvironmentalSubsystem, string> = new Map([
    [EnvironmentalSubsystem.AirQuality, '#da91ff'],
    [EnvironmentalSubsystem.CoastalWater, '#809fff'],
    [EnvironmentalSubsystem.Biodiversity, '#80ff80'],
    [EnvironmentalSubsystem.Radiation, '#ffe380'],
]);

export const environmentalSubsystemLabels: Map<EnvironmentalSubsystem, string> = new Map([
    [EnvironmentalSubsystem.AirQuality, 'Якість повітря'],
    [EnvironmentalSubsystem.CoastalWater, 'Прибережні води'],
    [EnvironmentalSubsystem.Biodiversity, 'Біорізноманіття'],
    [EnvironmentalSubsystem.Radiation, 'Радіація'],
]);

export const aqiLevels: Map<number, { color: string, label: string, description: string }> = new Map([
    [50, { color: '#4CAF50', label: 'добрий', description: 'Якість повітря сприятлива, загроз для здоров’я немає.' }],
    [100, { color: '#FFEB3B', label: 'помірний', description: 'Якість повітря прийнятна, але у деяких людей може виникати дискомфорт.' }],
    [150, { color: '#FF9800', label: 'шкідливий для чутливих груп', description: 'Чутливі групи (діти, люди з хронічними хворобами) можуть відчувати труднощі з диханням.' }],
    [200, { color: '#F44336', label: 'нездоровий', description: 'Люди починають відчувати негативний вплив на здоров’я, зокрема утруднене дихання.' }],
    [300, { color: '#D32F2F', label: 'дуже нездоровий', description: 'Можливі попередження про надзвичайний стан. Всі люди можуть зазнати впливу.' }],
    [500, { color: '#B71C1C', label: 'небезпечний', description: 'Серйозні загрози для здоров’я: утруднене дихання, задуха, подразнення дихальних шляхів у всіх.' }]
]);

export const waterQualities: Map<number, { color: string, label: string, description: string }> = new Map([
    [1, { color: '#4CAF50', label: 'задовільна', description: 'Вода відповідає стандартам, без загрози для здоров’я.'}],
    [10000, { color: '#D32F2F', label: 'незадовільна', description: 'Висока концентрація шкідливих речовин, може бути небезпечною для здоров’я.'}]
]);

export const radiationLevels: Map<number, { color: string, label: string, description: string }> = new Map([
    [300, { color: '#4CAF50', label: 'безпечний', description: 'Нормальний рівень радіації, без загрози для здоров\'я.' }],
    [500, { color: '#FFEB3B', label: 'підвищений', description: 'Рівень радіації, який потребує контролю.' }],
    [1000, { color: '#FF9800', label: 'високий', description: 'Може бути небезпечним при тривалому впливі.' }],
    [5000, { color: '#F44336', label: 'небезпечний', description: 'Серйозний ризик для здоров\'я при тривалому впливі.' }],
    [10000, { color: '#D32F2F', label: 'критичний', description: 'Надзвичайно небезпечний рівень, негайне втручання необхідне.' }]
]);
