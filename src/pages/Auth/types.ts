export interface Client {
  clientId: string;
  clientName: string;
  clientUrl: string;
}

export interface ClientDetail {
  clientId: string;
  clientSecret: string;
  dodamId: string;
  clientName: string;
  clientUrl: string;
  redirectUrl: string;
}

export interface Stats {
  [key: string]: [number, string];
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface RegisterData {
  clientName: string;
  clientUrl: string;
  redirectUrl: string;
  frontEnd: string;
  backEnd: string;
}
