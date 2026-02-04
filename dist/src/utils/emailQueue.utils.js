import { Queue, Worker } from "bullmq";
import apiError from "./apiError.utils.js";
import { sendMail } from "./sendEmail.utils.js";
import { queueConnection, workerConnection } from "../config/index.js";
const authQueue = new Queue("authQueue", { connection: queueConnection });
const registeredQueue = new Queue("registeredQueue", {
    connection: queueConnection,
});
export const addMailInQueue = async (email, subject, html) => {
    await authQueue.add(subject, {
        email,
        html,
    }, {
        delay: 5000,
        attempts: 2,
        backoff: {
            type: "exponential",
            delay: 2000,
        },
    });
};
const worker = new Worker("authQueue", async (Job) => {
    const { email, html } = Job.data;
    const subject = Job.name;
    console.log(subject, email);
    if (!subject || !email || !html)
        throw new apiError(500, "email credentials missing");
    console.log("email sending");
    await sendMail(email, subject, html);
}, {
    connection: workerConnection,
});
