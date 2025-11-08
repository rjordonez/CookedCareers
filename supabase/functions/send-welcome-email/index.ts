import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

console.log("✅ Send Welcome Email function started");

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
      }
    });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error("❌ Missing RESEND_API_KEY");
      return new Response(JSON.stringify({ error: "Missing RESEND_API_KEY" }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const contentType = (req.headers.get("Content-Type") || "").toLowerCase();
    let email = "";
    let first_name = "";

    // Parse Supabase trigger payload
    if (contentType.includes("application/json")) {
      const bodyText = await req.text();
      console.log("➡️ Raw JSON body:", bodyText);
      const parsed = JSON.parse(bodyText);
      email = parsed?.record?.email;
      first_name =
        parsed?.record?.raw_user_meta_data?.first_name ||
        email?.split("@")[0] ||
        "there";
    } else {
      return new Response(JSON.stringify({ error: "Unsupported Content-Type" }), {
        status: 415,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    if (!email) {
      console.error("❌ Missing email field in payload");
      return new Response(JSON.stringify({ error: "Missing user email" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    console.log("➡️ Sending welcome email to:", email);

    // ✅ Your founder-style email (simple + safe HTML)
    const html = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 40px auto; background: #fff; border-radius: 12px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <p>Hey ${first_name},</p>
            <p>I’m Jessica, Co-founder of <strong>Cooked Career</strong>. Landing a CS job is hard — we built Cooked Career to make it easier.</p>

            <p>Here’s how to start:</p>
            <ul>
              <li>Explore real resumes and projects that got people hired.</li>
              <li>Create your anonymous profile to get feedback.</li>
              <li>Upload your resume for expert review instantly.</li>
            </ul>

            <p>We’re also working on a new feature to help you tailor your resume to any job description — stay tuned!</p>

            <p>We’re excited to have you with us.</p>

            <p>Hit “Reply” and tell us your feedback if any. I read and reply to every email.</p>

            <p>Cheers,<br>Jessica</p>
          </div>
        </body>
      </html>
    `;

    // Send via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Jessica from Cooked Career <jessica@cookedcareer.com>",
        to: email,
        subject: "Welcome to Cooked Career 🎉",
        html,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Failed to send email:", errorText);
      return new Response(JSON.stringify({ error: "Failed to send email", detail: errorText }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    console.log("✅ Welcome email sent successfully to:", email);
    return new Response(JSON.stringify({ status: "ok", email }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });

  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
