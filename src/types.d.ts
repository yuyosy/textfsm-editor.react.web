export interface Results {
  ok: boolean;
  message: string;
  message_detail: string;
  headers: string[];
  results: object[];
}

export interface ResultObject {
  ok: boolean;
  timestamp: string;
  results: Results;
  message: string;
  message_detail: string;
}
