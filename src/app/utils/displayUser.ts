import { getStoredCurrentUser } from "../../api/userApi";
import type { ConnectedPartner } from "../../api/partnerApi";

export function fallbackNameFromEmail(email?: string): string {
  if (!email) return "나";
  return email.split("@")[0] || "나";
}

export function getCurrentDisplayUser() {
  const user = getStoredCurrentUser();
  const nickname = user.nickname || fallbackNameFromEmail(user.email);

  return {
    ...user,
    nickname,
    initial: nickname.slice(0, 1).toUpperCase(),
  };
}

export function getPartnerDisplayName(partner?: Pick<ConnectedPartner, "nickname"> | null): string {
  const nickname = partner?.nickname?.trim();
  if (!nickname || nickname.toLowerCase() === "null") return "상대방";
  return nickname;
}
