import { CONTACT, SITE_NAME } from '@/lib/seo';

/**
 * Shared branded wrapper for every transactional email — same visual
 * language as the Supabase auth templates (supabase/email-templates/*.html):
 * dark header wordmark, gold CTA button, legal footer. Table-based markup
 * for email-client compatibility (Outlook doesn't support flex/grid).
 */
export function renderEmailShell({
  title,
  bodyHtml,
  ctaLabel,
  ctaUrl,
}: {
  title: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaUrl?: string;
}): string {
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 0;font-family:Helvetica,Arial,sans-serif;">
  <tr>
    <td align="center">
      <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e5e5;">
        <tr>
          <td style="background-color:#0b0b12;padding:28px 32px;text-align:center;">
            <span style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:600;color:#ffffff;letter-spacing:0.5px;">${SITE_NAME}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px 8px;">
            <h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#0b0b12;">${title}</h1>
            <div style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#3f3f46;">${bodyHtml}</div>
          </td>
        </tr>
        ${
          ctaLabel && ctaUrl
            ? `<tr>
          <td style="padding:0 40px 32px;text-align:center;">
            <a href="${ctaUrl}"
               style="display:inline-block;background-color:#c9a961;color:#0b0b12;font-size:15px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:999px;">
              ${ctaLabel}
            </a>
          </td>
        </tr>`
            : ''
        }
        <tr>
          <td style="background-color:#fafafa;padding:20px 40px;border-top:1px solid #e5e5e5;text-align:center;">
            <p style="margin:0 0 4px;font-size:12px;color:#a1a1aa;">${SITE_NAME} — ${CONTACT.founder}, independent travel agent</p>
            <p style="margin:0 0 4px;font-size:12px;color:#a1a1aa;">${CONTACT.city}, Brazil · MEI ${CONTACT.cnpj}</p>
            <p style="margin:0;font-size:12px;color:#a1a1aa;">
              <a href="mailto:${CONTACT.email}" style="color:#a1a1aa;">${CONTACT.email}</a>
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}
