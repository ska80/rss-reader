"use strict";

const {debugEnabled, enableDebug} = require("./environ.js");
const {log, setupLogger} = require("./logger.js");
const {loadConfig} = require("./config.js");
const http = require("./http.js");

const process = require("process");
const options = require("commander");

function parseCLI() {
    options
        .version("0.0.0", "-v, --version")
        .description("RSS Reader.")
        .option("-d, --debug", "enable debug mode")
        .option("-c, --config <configuration file>", "configuration file", "./config/config.json")
        .option(
            "-l, --loglevel <logging level>",
            "logging level",
            /^(error|warn|info|debug)$/i,
            "info"
        )
        .parse(process.argv);

    return {
        debug: options.debug && options.debug == true,
        loglevel: options.loglevel,
        config: options.config
    };
}

class Server {
    constructor() {}

    boot() {
        const options = parseCLI();

        if (options.debug) {
            enableDebug();
        }

        setupLogger(debugEnabled() ? "debug" : options.loglevel);

        log.info("Starting server...");

        if (debugEnabled()) {
            log.warn("Running in DEBUG mode.");
        }

        loadConfig(options.config);

        process.once("SIGHUP", () => {
            log.warn("Caught SIGHUP signal.");
        });

        process.once("SIGTERM", () => {
            log.warn("Shutdown has been requested.");

            this.stop();
        });

        ///
        http.serve();
        ///

        log.info("Server started.");
    }

    stop() {
        log.info("Shutting down server...");

        // TODO: graceful shutdown

        log.info("Server shut down.");
    }
}

const server = new Server();

module.exports = exports = server;

if (!module.parent) {
    server.boot();
}
