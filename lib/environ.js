"use strict";

const {env} = require("process");

var debugMode = env.NODE_ENV !== "production";

function enableDebug() {
    debugMode = true;
}

function debugEnabled() {
    return debugMode;
}

exports.enableDebug = enableDebug;
exports.debugEnabled = debugEnabled;
