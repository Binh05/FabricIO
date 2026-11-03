import { FieldError } from "./FieldError";

export interface FileGameDropProps {
  label: string;
  hint: string;
  icon: React.ReactNode;
  accept?: string;
  multiple?: boolean;
  fileName?: string;
  error?: string;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}

export const FileGameDrop = ({
  label,
  hint,
  icon,
  accept,
  multiple,
  fileName,
  error,
  inputProps,
}: FileGameDropProps) => (
  <div className="flex flex-col gap-1.5">
    <label className="block text-sm font-semibold">{label}</label>
    <label
      className={`border-border hover:border-primary flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
        error ? "border-red-500/60" : ""
      }`}
    >
      <span className="text-muted">{icon}</span>
      <span className="text-muted text-xs">{fileName ?? hint}</span>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        {...inputProps}
      />
    </label>
    <FieldError message={error} />
  </div>
);

export default FileGameDrop;
