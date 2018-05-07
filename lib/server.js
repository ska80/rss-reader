"use strict";

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
    console.log(`${ctx.method} ${ctx.url} - ${ms}`);
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

class Server {
    boot() {
        app.listen(8080);
    }
}

const server = new Server();

module.exports = exports = server;

if (!module.parent) {
    server.boot();
}
