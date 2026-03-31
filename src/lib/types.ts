
export interface Notice {
  id: string;
  title: string;
  link: string;
  date: string;
  category?: string;
}

export interface NoticeResponse {
  notices: Notice[];
  lastUpdated: number;
}
