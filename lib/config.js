"use strict";

const {log} = require("./logger.js");

const {readFileSync} = require("fs");

const Ajv = require("ajv");
const ajv = new Ajv({allErrors: true, format: "full"});

var configData = {};

function config() {
    return configData;
}

function validateConfig(configData) {
    const schema = JSON.parse(readFileSync("./schemas/config.schema.json", "utf8"));
    const valid = ajv.validate(schema, configData);

    if (!valid) {
        throw new Error("Invalid configuration: " + ajv.errors);
    }

    return configData;
}

function loadConfig(configFile) {
    try {
        configData = validateConfig(JSON.parse(readFileSync(configFile, "utf8")));

        log.info("Using config file: " + configFile);
    } catch (exception) {
        log.error("Please ensure you have a valid config file.", exception);
    }

    return configData;
}

exports.config = config;
exports.loadConfig = loadConfig;
