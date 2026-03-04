import { z } from "zod";

export const AddressSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  pinCode: z.string().regex(/^\d{6}$/, "Invalid PIN code"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
});