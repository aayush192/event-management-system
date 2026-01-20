import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: `aiden.nitzsche@ethereal.email`,
    pass: `1wbeydGHb2h1pqdAvF`,
  },
});

export const sendMail = async (email: string, date: Date, otp: string) => {
  const info = await transporter.sendMail({
    from: `aiden.nitzsche@ethereal.email`,
    to: `${email}`,
    subject: `opt for password`,
    text: `Your OTP is ${otp}.
It is valid for 5 minutes.
Do not share this code with anyone.`,
  });

  return info;
};
