const fs = require('fs')
const path = require('path')
const { createLogger: createWinstonInstance, format, transports } = require('winston')
require('winston-daily-rotate-file')
let __logger

exports.getLoggerInstance = (options) => {
    const _creatLogger = (options) => {
        const { combine, timestamp } = format
        const {
            logDir,
        } = options

        if (!logDir) {
            throw new Error('no logDir!')
        }
        const logger = createWinstonInstance({
            level: 'info',
            transports: [],
            format: combine(
                timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSS+08:00', alias: 'logtime' }),
                format.json(),
            ),
        })
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir)
        }

        logger.clear().add(
            new transports.DailyRotateFile({
                name: 'file',
                datePattern: 'YYYY-MM-DD-HH',
                filename: path.join(logDir, '%DATE%.log'),
                zippedArchive: false,
            }),
        )
        logger.add(
            new transports.Console({
                format: combine(
                    format.colorize(),
                    timestamp(),
                    format.align(),
                    format.printf(
                        info => `${info.timestamp} [${info.level}]: ${info.message}`,
                    ),
                ),
            }),
        )
        return logger
    }
    if (!__logger) {
        __logger = _creatLogger(options)
    }
    return __logger
}
