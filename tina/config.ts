import { defineConfig } from "tinacms";
import tags from '../src/data/highlights/tags.json'
import books from '../src/data/highlights/books.json'

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";



export default defineConfig({
  branch,
  clientId: process.env.TINA_PUBLIC_CLIENT_ID, // Get this from tina.io
  token: process.env.TINA_TOKEN, // Get this from tina.io
  search: {
    tina: {
      stopwordLanguages: ['eng'],
      indexerToken: process.env.TINA_SEARCH_TOKEN
    },
    maxSearchIndexFieldLength: 999999,
  },
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "data",
        label: "Data",
        path: "src/data/highlights",
        format: 'json',
        templates: [
          {
            name: 'tags',
            label: "Tags",
            fields: [
              {
                name: "tags",
                list: true,
                label: "Tags",
                type: "string",
                required: true
              }
            ]
          },
          {
            name: "books",
            label: "Books",
            fields: [
              {
                name: "books",
                label: "Books",
                list: true,
                type: "object",
                ui: {
                  itemProps: (values) => ({
                    label: values?.title,
                  }),
                },
                fields: [
                  {
                    name: "title",
                    label: "Title",
                    type: "string",
                  },
                  {
                    name: "olid",
                    label: "OLID",
                    type: "string",
                    required: true,
                  },
                ]
              },

            ]
          },
          {
            name: 'highlights',
            label: 'Highlights',
            fields: [
              {
                name: "highlights",
                list: true,
                label: "Highlights",
                type: "object",
                required: true,
                ui: {
                  itemProps: (values) => ({
                    label: ": " + values?.text,
                  }),
                },
                fields: [
                  {
                    name: "text",
                    label: "Text",
                    type: "string",
                    required: true,
                  },
                  {
                    name: "timestamp",
                    label: "Date Highlighted",
                    type: "datetime",
                    required: true,
                  },
                  {
                    name: "source",
                    label: "Source",
                    type: "string",
                    required: true,
                    options: books.books.map((book) => { return { value: book.olid, label: book.title } })
                  },
                  {
                    name: "tag",
                    label: "Tag",
                    type: "string",
                    list: true,
                    options: tags.tags.map(tag => { return { value: tag, label: tag } })
                  },
                ]
              }
            ],
          },
        ]
      },
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
            type: "string",
            name: "description",
            label: "Description",
            required: false,
          },
          {
            type: "datetime",
            name: "pubDate",
            label: "Date Posted",
            required: true,
          },
          {
            name: 'draft',
            label: 'Draft',
            type: 'boolean',
            required: true,
            description: 'Drafts will be saved but not publicly visible.',
          },
          {
            type: "rich-text",
            label: "Body",
            name: "body",
            isBody: true,
            templates: [
              {
                name: "Highlight",
                label: "Highlight",
                fields: [{
                  name: "highlightId",
                  type: "string"
                }]
              }
            ],
          }
        ],
      },
    ],
  },
});