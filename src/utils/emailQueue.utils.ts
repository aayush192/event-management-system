import IoRedis from "ioredis";
import { Job, Queue, Worker } from "bullmq";
import config from "../config/config";
import apiError from "./apiError.utils";
import { sendMail } from "./sendEmail.utils";
import { queueConnection, workerConnection } from "../config";
const myQueue = new Queue("emailQueue", { connection: queueConnection });

export const addMailInQueue = async (
  email: string,
  subject: string,
  html: string
) => {
  await myQueue.add(
    subject,
    {
      email,
      html,
    },
    {
      delay: 5000,
      attempts: 2,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
    }
  );
};

const worker = new Worker(
  "emailQueue",
  async (Job) => {
    const { email, html } = Job.data;
    const subject = Job.name;
    console.log(subject, email);
    if (!subject || !email || !html)
      throw new apiError(500, "email credentials missing");

    console.log("email sending");
    await sendMail(email, subject, html);
  },
  {
    connection: workerConnection,
  }
);




