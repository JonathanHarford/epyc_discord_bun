export const countdown = (msec: number): string => {
    // format 2 hours, 34 minutes, 48 seconds as: 02:34:48
    return new Date(msec).toISOString().substr(11, 8);
}