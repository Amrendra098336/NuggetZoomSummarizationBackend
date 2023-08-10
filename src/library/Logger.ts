import { createLogger, format, transports } from 'winston';

const logger = createLogger({
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf((info) => `[${info.timestamp}] : [${info.level.toUpperCase()}] :: ${info.message}`)
    ),
    transports: [
        new transports.Console({
            format: format.combine(format.colorize(), format.simple())
        }),
        new transports.File({ filename: 'server.log' })
    ]
});

export default logger;
