/** Cliente vinculado ao ticket (API de atendimento). */
export interface AtendimentoTicketClient {
  id: string;
  personType: number;
  profileType: number;
  businessName: string | null;
  email: string | null;
  phone: string | null;
  isDeleted: boolean;
  pathPicture: string | null;
  address: string | null;
  complement: string | null;
  cep: string | null;
  city: string | null;
  bairro: string | null;
  number: string | null;
  reference: string | null;
}

/** Ticket retornado por GET /api/movidesk/tickets */
export interface AtendimentoTicket {
  tags: string[];
  serviceFull: string[];
  serviceFirstLevelId: number;
  lastUpdate: string;
  closedIn: string | null;
  resolvedIn: string | null;
  createdDate: string;
  ownerTeam: string;
  origin: number;
  baseStatus: string;
  status: string;
  urgency: string;
  category: string | null;
  subject: string;
  type: number;
  id: number;
  clients: AtendimentoTicketClient[];
}
