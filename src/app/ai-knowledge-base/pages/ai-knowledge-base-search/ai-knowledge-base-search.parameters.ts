import { SearchAIKnowledgeBaseRequest } from 'src/app/shared/generated'
import { z, ZodTypeAny } from 'zod'

export const aiKnowledgeBaseSearchCriteriasSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional()
} satisfies Partial<Record<keyof SearchAIKnowledgeBaseRequest, ZodTypeAny>>)

export type AiKnowledgeBaseSearchCriteria = z.infer<typeof aiKnowledgeBaseSearchCriteriasSchema>
