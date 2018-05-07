"use strict";

const {debugEnabled} = require("./environ.js");

const {createLogger, format, transports} = require("winston");

const chalk = require("chalk");

const logTransports = [
    new transports.Console({
        level: "info"
    })
];

const logFormatEntry = format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`);

const logFormats = {
    production: format.combine(format.timestamp(), format.json()),
    debug: format.combine(
        format.colorize(),
        format.splat(),
        format.simple(),
        format.timestamp(),
        logFormatEntry
    )
};

const log = createLogger({
    format: logFormats.production,
    transports: logTransports
});

function setupLogger(loglevel) {
    if (debugEnabled()) {
        log.format = logFormats.debug;
    }

    logTransports.map(transport => (transport.level = loglevel));
}

const HTTP_STATUS_COLORS = {
    error: "red",
    warn: "yellow",
    debug: "green"
};

function koaLogger(logger) {
    if (debugEnabled()) {
        return async (ctx, next) => {
            const start = Date.now();
            await next();
            const ms = Date.now() - start;

            let level;
            if (ctx.status >= 500) {
                level = "error";
            }
            else if (ctx.status >= 400) {
                level = "warn";
            }
            else if (ctx.status >= 100) {
                level = "debug";
            }

            const msg = chalk.white(`${ctx.method} `) +
                chalk[HTTP_STATUS_COLORS[level]](`${ctx.status} `) +
                chalk.white(`${ctx.originalUrl} ${ms}ms`);

            logger.log(level, msg);
        };
    }
    else {
        return async (ctx, next) => {
            await next();

            if(ctx.status >= 400) {
                const msg = `${ctx.method} ${ctx.status} ${ctx.originalUrl}`;

                if (ctx.status >= 500) {
                    logger.error(msg);
                }
                else if (ctx.status >= 400) {
                    logger.warn(msg);
                }
            }
        };
    }
}

exports.log = log;
exports.setupLogger = setupLogger;
exports.koaLogger = koaLogger;
