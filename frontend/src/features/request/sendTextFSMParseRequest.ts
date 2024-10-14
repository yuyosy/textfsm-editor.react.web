import { api } from '@/features/api';
import { debounce } from '@/features/request/debounce';
import { TextFSMParseAPIResponse } from '@/features/types';
import { ResultItem } from '@/layouts/types';

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
    '/parse',
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
  } catch {
    const results: ResultItem = {
      ok: false,
      status: '',
      code: 0,
      data: undefined,
      errors: [{ status: '', reason: '', message: '' }],
      timestamp: new Date().toLocaleString(),
    };
    return results;
  }
};
