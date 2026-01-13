import { prisma } from "../lib/prisma";
interface Data {
  name: string;
  description: string;
  eventdate: Date;
}
export const postEventServices = async (data: Data, userId: number) => {
  try {
    const event = await prisma.event.create({
      data: {
        name: data.name,
        description: data.description,
        eventdate: data.eventdate,
        userId: userId,
      },
    });
    return event;
  } catch (error) {
    throw new Error(`internal error : ${error}`);
  }
};
