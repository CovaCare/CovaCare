export type Contact = {
  id: number;
  name: string;
  phone_number: string;
  status: 0 | 1;
  created_at?: string;
  updated_at?: string;
};

export type NewContact = Omit<Contact, "id" | "created_at" | "updated_at">;
