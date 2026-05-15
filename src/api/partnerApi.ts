import apiClient from "./client";

export interface ConnectedPartner {
  friendId: number;
  nickname: string;
  mbti: string;
  attachmentTypeDescription: string;
}

export async function getConnectedPartners(): Promise<ConnectedPartner[]> {
  const response = await apiClient.get<ConnectedPartner[]>("/api/friends/list");
  return response.data;
}

export async function addPartnerByCode(friendCode: string): Promise<void> {
  await apiClient.post("/api/friends/add", { friendCode });
}
