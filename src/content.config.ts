import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const writeups=defineCollection({loader:glob({pattern:'**/*.md',base:'./src/content/writeups'}),schema:z.object({title:z.string(),platform:z.string(),difficulty:z.enum(['Easy','Medium','Hard','Insane','Notes']),date:z.coerce.date(),summary:z.string(),tags:z.array(z.string()),status:z.enum(['Completed','Guided','In progress']),published:z.boolean().default(false)})});
export const collections={writeups};