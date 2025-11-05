import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { gender, personality, appearance, interests, language, chatStyle, notes, contact, email } = req.body;
    const { error } = await supabase.from("real_companion_requests").insert([
      {
        gender,
        personality,
        appearance,
        interests,
        language,
        chat_style: chatStyle,
        notes,
        contact,
        email
      },
    ]);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Database insert failed" });
    }
    res.status(200).json({ message: "Success" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
