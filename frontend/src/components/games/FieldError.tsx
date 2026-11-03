interface FieldErrorProps {
  message?: string;
}
export const FieldError = ({ message }: FieldErrorProps) =>
  message ? <p className="mt-1 text-xs text-red-400">{message}</p> : null;