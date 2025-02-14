import { AIProviderSearchRequest } from 'src/app/shared/generated'
import { z, ZodTypeAny } from 'zod'

export const AIProviderSearchCriteriasSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  llmUrl: z.string().optional(),
  modelName: z.string().optional(),
  modelVersion: z.number().optional(),
  appId: z.number().optional(),
  id: z.number().optional(),
  limit: z.number().optional()
} satisfies Partial<Record<keyof AIProviderSearchRequest, ZodTypeAny>>)

export type AIProviderSearchCriteria = z.infer<typeof AIProviderSearchCriteriasSchema>