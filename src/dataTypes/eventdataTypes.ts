type EventCategory =
  | "CONFERENCE"
  | "WORKSHOP"
  | "MEETUP"
  | "WEBINAR"
  | "SEMINAR"
  | "SOCIAL"
  | "SPORTS"
  | "MUSIC"
  | "OTHER";

export interface Data {
  name: string;
  description: string;
  eventdate: Date;
  category: EventCategory;
}

export interface searchEventType {
  name?: string;
  category?: EventCategory;
  eventdate?: Date;
}
export type Status = "PENDING" | "APPROVED" | "REJECTED";
export interface updateEventData {
  id: number;
  status: Status;
}

export interface UserType {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "ORGANIZER" | "USER";
}
