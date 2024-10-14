interface TextFSMParseRequestData {
  template_string: string;
  data_string: string;
}

interface TextFSMParseAPIRequest {
  data: TextFSMParseRequestData;
}

export interface TextFSMParseResult {
  message: string;
  header: string[];
  results: object[];
}

export interface TextFSMParseAPIError {
  status: string;
  reason: string;
  message: string;
}

export interface TextFSMParseAPIResponse {
  ok: boolean;
  status: string;
  code: number;
  data: TextFSMParseResult | undefined;
  errors: Array<TextFSMParseAPIError> | undefined;
}

export interface RequestError {
  detail: string | object[];
}
