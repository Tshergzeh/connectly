export type User = {
  id: string;
  name: string;
  email: string;
  hashed_password: string;
  is_provider: boolean;
  is_customer: boolean;
  created_at: string;
  updated_at: string;
};
