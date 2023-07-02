export interface ResponseResult {
  ok: boolean;
  message: string;
  message_detail: string;
  headers: string[];
  results: object[];
}

export interface ResultObject {
  ok: boolean;
  timestamp: string;
  response_result: ResponseResult;
  result_message: string;
  result_message_detail: string;
}
