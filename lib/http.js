"use strict";

const {log} = require("./logger.js");
const {config} = require("./config.js");

const Koa = require("koa");
const app = new Koa();

// x-response-time
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();

    const ms = Date.now() - start;
    ctx.set("X-Response-Time", `${ms}ms`);
});

// logger
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();

    const ms = Date.now() - start;
    log.debug(`${ctx.method} ${ctx.url} - ${ms}`);
});

// response
app.use(async ctx => {
    ctx.body = "Hello World";
});

// error handlers
app.on("error", err => {
    log.error("server error", err);
});

app.on("error", (err, ctx) => {
    log.error("server error", err, ctx);
});

exports.serve = function() {
    const http = config().http;

    app.listen(http.port, http.hostname);
};
