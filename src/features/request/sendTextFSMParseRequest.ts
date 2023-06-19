import { debounce } from './debounce';
import { request } from './request';

type Results = {
  ok: boolean;
  message: string;
  message_detail: string;
  headers: string[];
  results: object[];
};

export type ResultObject = {
  ok: boolean;
  timestamp: string;
  results: Results;
  message: string;
  message_detail: string;
};

const getResult = (ok: boolean, results: any, message = '', message_detail = ''): ResultObject => {
  return {
    ok: ok,
    timestamp: new Date().toLocaleString(),
    results: results,
    message: message,
    message_detail: message_detail,
  };
};

export const requestTextFSMParse = async (dataValue: string, templateValue: string) => {
  if (templateValue === '') {
    return getResult(false, {}, 'Empty Template', 'Template value is empty.');
  }

  const headers_obj: { [key: string]: string } = {
    'Content-Type': 'application/json',
  };
  if (import.meta.env.VITE_USE_API_KEY === 'true') {
    headers_obj[import.meta.env.VITE_HEADER_API_KEY_NAME] =
      import.meta.env.VITE_HEADER_API_KEY_VALUE;
  }

  const requestUrl = import.meta.env.VITE_API_ENTRYPOINT_TEXTFSM_PARSE;
  const requestBody = {
    method: 'POST',
    headers: headers_obj,
    body: JSON.stringify({
      target_data: dataValue,
      template_data: templateValue,
    }),
  };

  try {
    const results = await request(requestUrl, requestBody);
    return getResult(true, results);
  } catch (error: any) {
    return getResult(false, {}, error.name, error.message);
  }
};

export const sendTextFSMParseRequest = async (values: EditorValues): Promise<ResultObject> => {
  await debounce();
  const resultObject = await requestTextFSMParse(
    values.dataEditorValue,
    values.templateEditorValue
  );
  console.log(resultObject);
  return resultObject;
};
