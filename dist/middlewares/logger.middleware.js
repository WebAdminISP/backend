"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerGlobal = LoggerGlobal;
function LoggerGlobal(req, res, next) {
    const currentDate = new Date();
    const optionsDate = {
        timeZone: 'America/Argentina/Buenos_Aires',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    };
    const optionsTime = {
        timeZone: 'America/Argentina/Buenos_Aires',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };
    const formattedDate = currentDate.toLocaleDateString('en-CA', optionsDate);
    const formattedTime = currentDate.toLocaleTimeString('en-GB', optionsTime);
    console.log(`Está ejecutando un método ${req.method} en la ruta ${req.url} ${formattedDate} ${formattedTime} `);
    next();
}
//# sourceMappingURL=logger.middleware.js.map