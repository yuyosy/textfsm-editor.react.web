export interface ParseResult {
  message: string;
  headers: string[];
  results: object[];
}

export interface APIError {
  status: string;
  code: number;
  reason: string;
  message: string;
}

export interface APIResponseData {
  parse_result: ParseResult;
}

export interface APIResponse {
  ok: boolean;
  status: string;
  code: number;
  data: APIResponseData;
  errors: Array<APIError>;
}
