export type ConnectionPurpose =
  | "discuss_opportunity"
  | "look_for_opportunity"
  | "apply_for_opportunity"
  | "referral"
  | "other";

export type ConnectionStatus =
  | "to_reach_out"
  | "messaged"
  | "replied"
  | "not_interested";

export const CONNECTION_PURPOSE_LABELS: Record<ConnectionPurpose, string> = {
  discuss_opportunity: "Discuss Opportunity",
  look_for_opportunity: "Look for Opportunity",
  apply_for_opportunity: "Apply for Opportunity",
  referral: "Referral",
  other: "Other",
};

export const CONNECTION_STATUS_LABELS: Record<ConnectionStatus, string> = {
  to_reach_out: "To Reach Out",
  messaged: "Messaged",
  replied: "Replied",
  not_interested: "Not Interested",
};

export interface Connection {
  id: string;
  userId: string;
  name: string;
  linkedinUrl: string;
  purpose: ConnectionPurpose;
  customPurpose?: string;
  status: ConnectionStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateConnectionInput {
  name: string;
  linkedinUrl: string;
  purpose: ConnectionPurpose;
  customPurpose?: string;
  status?: ConnectionStatus;
  notes?: string;
}

export interface UpdateConnectionInput {
  name?: string;
  linkedinUrl?: string;
  purpose?: ConnectionPurpose;
  customPurpose?: string;
  status?: ConnectionStatus;
  notes?: string;
}
