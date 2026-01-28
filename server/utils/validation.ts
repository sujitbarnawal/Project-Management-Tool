import {z} from "zod"

export const registerSchema= z.object({
    email:z.string().email("Invalid email address"),
    password:z.string().min(8,"Password must be atleats 8 characters"),
    name:z.string().min(3,"Name must be atleast 2 characters").max(255),
})

export const loginSchema=z.object({
    email:z.string().email("Invalid email address"),
    password:z.string().min(8,"Password must be atleast 8 characters")
})

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  email: z.string().email().optional(),
});

export const changePasswordSchema=z.object({
    currentPassword:z.string().min(1,'Current Password is required'),
    newPassword:z.string().min(8,"New password must be atleast 8 characters")
})