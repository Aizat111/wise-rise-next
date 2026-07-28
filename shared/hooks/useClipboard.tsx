import { notify } from '@/core/lib/notify';

const useClipboard = () => {
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    notify('success', 'success.success', 'copied_to_clipboard');
  };

  return { copy };
};

export default useClipboard;
