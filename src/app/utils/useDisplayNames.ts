import { useEffect, useState } from "react";
import { getConnectedPartners, type ConnectedPartner } from "../../api/partnerApi";
import { fetchCurrentUserProfile } from "../../api/userApi";
import { fallbackNameFromEmail, getCurrentDisplayUser, getPartnerDisplayName } from "./displayUser";

export function useDisplayNames() {
  const [currentUser, setCurrentUser] = useState(() => getCurrentDisplayUser());
  const [partner, setPartner] = useState<ConnectedPartner | null>(null);

  useEffect(() => {
    let mounted = true;

    fetchCurrentUserProfile().then((profile) => {
      if (!mounted || !profile) return;
      const nickname = profile.nickname || fallbackNameFromEmail(profile.email);
      setCurrentUser({
        ...profile,
        nickname,
        initial: nickname.slice(0, 1).toUpperCase(),
      });
    });

    getConnectedPartners()
      .then((partners) => {
        if (!mounted) return;
        setPartner(partners[0] ?? null);
      })
      .catch((error) => {
        console.error("[UI] Failed to load partner display name:", error);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const currentName = currentUser.nickname || fallbackNameFromEmail(currentUser.email);
  const partnerName = getPartnerDisplayName(partner);

  return {
    currentUser,
    currentName,
    currentInitial: currentName.slice(0, 1).toUpperCase(),
    partner,
    partnerName,
    partnerInitial: partnerName.slice(0, 1).toUpperCase(),
  };
}
