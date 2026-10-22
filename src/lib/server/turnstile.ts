// Turnstile 服务端校验（architecture §14）。token 一次性、5 分钟有效、最长 2048 字符。
const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export const verifyTurnstile = async (
  secret: string,
  token: string,
  remoteip?: string,
): Promise<boolean> => {
  if (!token || token.length > 2048) return false;
  const response = await fetch(SITEVERIFY, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ secret, response: token, remoteip }),
  });
  if (!response.ok) return false;
  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
};
