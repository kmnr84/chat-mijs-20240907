export const useCurrentUser = () => {
  const id = useState('id', () => (''));

  return { id };
};
