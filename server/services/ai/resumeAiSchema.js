import { z } from "zod";

const optionalText = z.string().trim().optional().default("");
const text = z.string().trim();

const personalInfoSchema = z
  .object({
    image: optionalText,
    full_name: optionalText,
    profession: optionalText,
    email: optionalText,
    phone: optionalText,
    location: optionalText,
    linkedin: optionalText,
    website: optionalText,
  })
  .strip();

const experienceSchema = z
  .object({
    company: optionalText,
    position: optionalText,
    start_date: optionalText,
    end_date: optionalText,
    description: optionalText,
    is_current: z.boolean().optional().default(false),
  })
  .strip();

const projectSchema = z
  .object({
    name: optionalText,
    type: optionalText,
    description: optionalText,
  })
  .strip();

const educationSchema = z
  .object({
    institution: optionalText,
    degree: optionalText,
    field: optionalText,
    graduation_date: optionalText,
    gpa: optionalText,
  })
  .strip();

export const resumeAiSchema = z
  .object({
    title: text.optional().default("Untitled Resume"),
    professional_summary: optionalText,
    personal_info: personalInfoSchema.optional().default({}),
    skills: z.array(text).optional().default([]),
    experience: z.array(experienceSchema).optional().default([]),
    project: z.array(projectSchema).optional().default([]),
    education: z.array(educationSchema).optional().default([]),
  })
  .strip();
