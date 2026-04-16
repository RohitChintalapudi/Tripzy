import crypto from "crypto";

export const generateTicketNumber = () => {
  const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `TICKET-${Date.now()}-${randomPart}`;
};
