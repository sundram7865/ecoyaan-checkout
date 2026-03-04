export const AddressSchema = import('zod').then((z) => z.z.object({
  fullName: z.z.string().min(2, "Name is required"),
  email: z.z.string().email("Invalid email address"),
  phone: z.z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  pinCode: z.z.string().regex(/^\d{6}$/, "Invalid PIN code"),
  city: z.z.string().min(2, "City is required"),
  state: z.z.string().min(2, "State is required"),
}));