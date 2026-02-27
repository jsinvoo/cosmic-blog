import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

import { Posts } from "./collections/Posts";
import { Categories } from "./collections/Categories";
import { Authors } from "./collections/Authors";
import { Media } from "./collections/Media";
import { Users } from "./collections/Users";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  editor: lexicalEditor(),
  collections: [Posts, Categories, Authors, Media, Users],
  secret: process.env.PAYLOAD_SECRET || "default-secret",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),
  sharp,
  plugins: [],
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " — Cosmic Curiosity",
    },
    theme: "dark",
  },
});
