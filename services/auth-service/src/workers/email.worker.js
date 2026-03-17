const { Worker } = require("bullmq");
const IORedis = require("ioredis");

const { sendMail } = require("../utils/mail.util");
const logger = require("../utils/logger");

const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: null
});

const worker = new Worker(
  "emailQueue",
  async job => {

    const { to, subject, html } = job.data;

    await sendMail({ to, subject, html });

    logger.info(`Email sent to ${to}`);

  },
  { connection }
);

worker.on("failed", (job, err) => {
  logger.error("Email job failed", err);
});