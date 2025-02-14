import { AIKnowledgeBaseSearchRequest } from 'src/app/shared/generated'
import { z, ZodTypeAny } from 'zod'

export const aIKnowledgeBaseSearchCriteriasSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    id: z.string().optional()
} satisfies Partial<Record<keyof AIKnowledgeBaseSearchRequest, ZodTypeAny>>)

export type AIKnowledgeBaseSearchCriteria = z.infer<typeof aIKnowledgeBaseSearchCriteriasSchema>
