"use strict";

const {debugEnabled} = require("./environ.js");

const {createLogger, format, transports} = require("winston");

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

exports.log = log;
exports.setupLogger = setupLogger;
