import { api } from '@/features/api';
import { debounce } from '@/features/request/debounce';
import { TextFSMParseAPIResponse } from '@/features/types';
import { ResultItem } from '@/types';

export const requestTextFSMParse = async (
  dataValue: string,
  templateValue: string
): Promise<TextFSMParseAPIResponse> => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return api.post(
    '/api/parse',
    {
      data: {
        data_string: dataValue,
        template_string: templateValue,
      },
    },
    config
  ) as Promise<TextFSMParseAPIResponse>;
};

const createResultItem = (resposne: TextFSMParseAPIResponse): ResultItem => {
  return {
    ...resposne,
    timestamp: new Date().toLocaleString(),
  };
};

export const createErrorResultItem = (error: unknown): ResultItem => {
  return {
    ok: false,
    status: '',
    code: 0,
    data: undefined,
    errors: [
      {
        status: '',
        reason: error instanceof Error ? error.constructor.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
      },
    ],
    timestamp: new Date().toLocaleString(),
  };
};
export const sendTextFSMParseRequest = async (
  dataValue: string,
  templateValue: string,
  delay?: number
): Promise<ResultItem> => {
  await debounce(delay);
  try {
    const resposne = await requestTextFSMParse(dataValue, templateValue);
    const results = createResultItem(resposne);
    console.log(results);
    return results;
  } catch (error) {
    console.error(error);
    return createErrorResultItem(error);
  }
};
