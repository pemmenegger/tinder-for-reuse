/////////////////////////////////////////////////////////////////////////////
// Do not modify this file directly. It is created from the API definition //
// See: ./backend/app/schemas/type_schema.py                               //
/////////////////////////////////////////////////////////////////////////////

export type UnifiedTypeRead = {
  id: number;
  discriminator: string;
  type_id: number;
  type_label: string;
};
