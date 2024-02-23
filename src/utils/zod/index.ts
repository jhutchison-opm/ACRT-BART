import { z } from "zod"

export const processTypeOptions = [
  "Automated Only",
  "Manual Only",
  "Hybrid (Automated and Manual)"
] as const

export const processSchema = z.object({
  processName: z.string().max(50),
  productName: z.string().max(50),
  processVersion: z.string().max(50),
  processType: z.enum(processTypeOptions),
  productUrl: z.string().url().max(150),
  processDesc: z.string().max(1000),
  notes: z.string().max(1000).optional()
})

export const submitterSchema = z.object({
  agencyName: z.string().max(100),
  submitterFirstName: z.string().max(50),
  submitterLastName: z.string().max(50),
  submitterRole: z.string().max(100).optional(),
  submitterEmail: z.string().email(),
  submitterNotes: z.string().max(1000)
})

export const resultSchema = z.object({
  id: z.number().optional(),
  testId: z.string(),
  testCaseId: z.string(),
  testName: z.string(),
  testComment: z.string()
})