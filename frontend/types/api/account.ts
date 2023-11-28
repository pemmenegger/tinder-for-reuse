/////////////////////////////////////////////////////////////////////////////
// Do not modify this file directly. It is created from the API definition //
// See: ./backend/app/schemas//account_schema.ts                           //
/////////////////////////////////////////////////////////////////////////////

type AccountBase = {
  email: string;
  display_name: string;
  phone?: string;
};

export type AccountRead = AccountBase & {
  id: number;
  is_email_verified: boolean;
};
