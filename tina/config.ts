import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,
  clientId: "fe460813-9c0d-48ad-b3d5-1cb7700fae99", // Get this from tina.io
  token: "c1e5d662717848c101fbef130986f26b5bbe7c0c", // Get this from tina.io
  build: {
    outputFolder: "dist",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "public/images",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "cards",
        label: "Cards",
        path: "src/content/cards",
        format: 'mdx',
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "datetime",
            name: "pubDate",
            label: "Date Posted",
            required: true,
          },
        ],
      },
    ],
  },
});