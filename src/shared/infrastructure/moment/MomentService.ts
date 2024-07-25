import Moment from 'moment-timezone';

export class MomentService {
    protected timezone = process.env.TIME_ZONE || '';

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
}
