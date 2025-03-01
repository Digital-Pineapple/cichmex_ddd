import Moment from 'moment-timezone';

export class MomentService {
    protected timezone = process.env.TIME_ZONE || 'America/Mexico_City'; // Establece un valor por defecto

    addMinutesToDate(minutes: number): Date {
        return Moment.tz(this.timezone).add(minutes, 'minutes').toDate();
    }

    verifyExpirationDate(date: Date): boolean {
        // Convierte la fecha de entrada a un objeto Moment
        const expirationDate = Moment(date).tz(this.timezone);

        // Obtiene la fecha y hora actual en la zona horaria especificada
        const currentDate = Moment.tz(this.timezone);

        // Compara las fechas usando isAfter
        return expirationDate.isBefore(currentDate);
    }

    newDate(): any {
        const newDate = Moment.tz(this.timezone).format(); // Usar la zona horaria definida
        return newDate;
    }

    convertUtcToLocal(utcDate: string): string {
        // Convierte la fecha UTC a la hora local de la Ciudad de México
        const localDate = Moment.utc(utcDate).tz(this.timezone);
        return localDate.format('YYYY-MM-DD HH:mm:ss'); // Formatea según lo necesites
    }
    convertUtcToLocalDD(utcDate: string): string {
        // Convierte la fecha UTC a la hora local de la Ciudad de México
        const localDate = Moment.utc(utcDate).tz(this.timezone);
        return localDate.format('DD-MM-YYYY HH:mm:ss'); // Formatea según lo necesites
    }
}