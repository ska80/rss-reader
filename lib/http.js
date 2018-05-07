"use strict";

const {log, koaLogger} = require("./logger.js");
const {config} = require("./config.js");

const Koa = require("koa");
const app = new Koa();

// logger
app.use(koaLogger(log));

// x-response-time
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;

    ctx.set("X-Response-Time", `${ms}ms`);
});

// response
app.use(async ctx => {
    ctx.body = "Hello World";
});

// error handlers
app.on("error", err => {
    log.error("Server error: " + err);
});

app.on("error", (err, ctx) => {
    log.error("Server error: " + err + ": " + ctx);
});

exports.serve = function() {
    const http = config().http;

    app.listen(http.port, http.hostname);
};
