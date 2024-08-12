"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTimeMiddleware = void 0;
const common_1 = require("@nestjs/common");
let DateTimeMiddleware = class DateTimeMiddleware {
    use(req, res, next) {
        const oldSend = res.send;
        res.send = function (...args) {
            const data = args[0];
            if (typeof data === 'string') {
                try {
                    let json = JSON.parse(data);
                    if (Array.isArray(json)) {
                        json = json.map((item) => formatDates(item));
                    }
                    else {
                        json = formatDates(json);
                    }
                    args[0] = JSON.stringify(json);
                }
                catch (e) {
                }
            }
            return oldSend.apply(res, args);
        };
        function formatDates(obj) {
            if (obj && typeof obj === 'object') {
                for (const key in obj) {
                    if (obj.hasOwnProperty(key) && obj[key] instanceof Date) {
                        const currentDate = new Date(obj[key]);
                        obj[key] = currentDate.toLocaleString('en-CA', {
                            timeZone: 'America/Argentina/Buenos_Aires',
                            month: '2-digit',
                            day: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: false,
                        });
                    }
                    else if (obj.hasOwnProperty(key) && typeof obj[key] === 'object') {
                        obj[key] = formatDates(obj[key]);
                    }
                }
            }
            return obj;
        }
        next();
    }
};
exports.DateTimeMiddleware = DateTimeMiddleware;
exports.DateTimeMiddleware = DateTimeMiddleware = __decorate([
    (0, common_1.Injectable)()
], DateTimeMiddleware);
//# sourceMappingURL=date-time.middleware.js.map