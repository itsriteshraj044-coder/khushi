import type { LoveFormData } from "@/types";

export type FieldKind = "text" | "email" | "date" | "textarea" | "select";

export interface FieldConfig {
  name: keyof LoveFormData;
  label: string;
  kind: FieldKind;
  required?: boolean;
  options?: string[];
  full?: boolean;
}

/** The love-form fields — shared by the form and the admin dashboard. */
export const FIELDS: FieldConfig[] = [
  { name: "yourName", label: "Your Name", kind: "text", required: true },
  { name: "partnerName", label: "Partner's Name", kind: "text", required: true },
  { name: "email", label: "Email", kind: "email", required: true },
  { name: "specialDate", label: "Your Special Date", kind: "date" },
  { name: "favoriteSong", label: "Favourite Song", kind: "text" },
  {
    name: "relationshipGoal",
    label: "Relationship Goal",
    kind: "select",
    options: ["Grow together", "Travel the world", "Build a home", "Forever & always"],
  },
  { name: "favoriteMemory", label: "Favourite Memory", kind: "textarea", full: true },
  { name: "loveMessage", label: "Your Love Message", kind: "textarea", required: true, full: true },
];

export const EMPTY_FORM: LoveFormData = {
  yourName: "",
  partnerName: "",
  email: "",
  specialDate: "",
  favoriteMemory: "",
  loveMessage: "",
  favoriteSong: "",
  relationshipGoal: "",
};

/** A stored submission row from Supabase. */
export interface Submission {
  id: string;
  created_at: string;
  data: LoveFormData;
}
