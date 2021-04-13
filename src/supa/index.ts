import { createClient } from "@supabase/supabase-js";

const supa = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_KEY ?? ""
);

export default supa;
