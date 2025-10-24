import { toast } from 'sonner';

// Función para copiar texto
export const copyToClipboardId = async (textTocopy: string) => {
  try {
    await navigator.clipboard.writeText(textTocopy);
    toast.info('El ID ha sido copiado al portapapeles');
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    toast.error('No se pudo copiar el ID al portapapeles');
  }
};

export const copyToClipboardText = async (textTocopy: string) => {
  try {
    await navigator.clipboard.writeText(textTocopy);
    toast.info('El texto ha sido copiado al portapapeles');
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    toast.error('No se pudo copiar el texto al portapapeles');
  }
};

export const maskUUIDToDisplay = (uuid: string): string => {
  return uuid.substring(0, uuid.indexOf('-', uuid.indexOf('-') + 1));
};
