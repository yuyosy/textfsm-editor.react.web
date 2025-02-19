import { Result } from '@/features/types'; // ...existing code...
import { useCallback } from 'react';

type DataDeliverParams = {
  header: string[];
  results: Result[];
};

export const useDataDeliver = ({ header, results }: DataDeliverParams) => {
  const tsvDataDeliver = useCallback((): string => {
    if (header && results) {
      const headerString = header.join('\t');
      const rowsString = results
        .map(row =>
          header.map(key => String(row[key] ?? '').replace(/\t/g, ' ')).join('\t')
        )
        .join('\n');
      return `${headerString}\n${rowsString}`;
    }
    return '';
  }, [header, results]);

  const jsonDataDeliver = useCallback((): string => {
    return JSON.stringify(results, null, '  ');
  }, [results]);

  return { tsvDataDeliver, jsonDataDeliver };
};
