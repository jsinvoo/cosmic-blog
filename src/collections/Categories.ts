import type { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "color",
      type: "select",
      options: [
        { label: "Blue", value: "blue" },
        { label: "Purple", value: "purple" },
        { label: "Green", value: "green" },
        { label: "Orange", value: "orange" },
        { label: "Pink", value: "pink" },
        { label: "Teal", value: "teal" },
      ],
      defaultValue: "blue",
    },
    {
      name: "description",
      type: "textarea",
    },
  ],
};
