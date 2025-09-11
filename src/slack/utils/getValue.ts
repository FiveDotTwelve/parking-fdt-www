type SlackViewValues = Record<
  string,
  Record<
    string,
    { selected_option?: { value: string }; selected_date?: string }
  >
>;

export const GetValue = (values: SlackViewValues, actionId: string): string | undefined => {
  return Object.values(values)
    .map(block => block[actionId]?.selected_option?.value || block[actionId]?.selected_date)
    .find(Boolean);
};
