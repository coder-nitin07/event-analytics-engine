import pino from "pino";

const logger = pino({
    level: process.env.LOG_LEVEL || "info",
    transport: {
        targets: [
            {
                target: 'pino-pretty',
                options: { colorize: true },
                level: 'info'
            },
            {
                target: "pino/file",
                options: { destination: "./logs/app.log" },
                level: "info",
            },
            {
                target: "pino/file",
                options: { destination: "./logs/error.log" },
                level: "error",
            },
        ]
    }
});

export default logger;