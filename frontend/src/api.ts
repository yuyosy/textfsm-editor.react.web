'use server'
export const getApi = async (): Promise<any> => {
  const response = await fetch('http://textfsm-editor-backend:8000');
  return response.json();
}
