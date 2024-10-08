interface RequestData {
  template_string: string;
  data_string: string;
}

interface APIRequest {
  data: RequestData;
}

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

export interface APIResponse {
  ok: boolean;
  status: string;
  code: number;
  data: ParseResult;
  errors: Array<APIError>;
}
