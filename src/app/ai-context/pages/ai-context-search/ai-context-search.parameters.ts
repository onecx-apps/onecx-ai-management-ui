import { SearchAiContextRequest } from 'src/app/shared/generated'
import { z, ZodTypeAny } from 'zod'

export const aiContextSearchCriteriasSchema = z.object({
  appId: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  // DONE: ACTION S2: Please define the members for your aiContextSearchCriteriasSchema here
  // https://onecx.github.io/docs/nx-plugins/current/general/getting_started/search/configure-search-criteria.html#action-2
} satisfies Partial<Record<keyof SearchAiContextRequest, ZodTypeAny>>)

export type AiContextSearchCriteria = z.infer<typeof aiContextSearchCriteriasSchema>
