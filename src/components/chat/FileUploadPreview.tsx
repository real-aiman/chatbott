import { FileText, File as FileIcon, X } from 'lucide-react';
import { formatBytes } from '../../utils/format';
import type { Attachment } from '../../types';

export function FileUploadPreview({
  attachments,
  onRemove,
}: {
  attachments: Attachment[];
  onRemove: (id: string) => void;
}) {
  if (attachments.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 px-1 pb-2">
      {attachments.map((file) => (
        <div
          key={file.id}
          className="glass relative flex items-center gap-2 rounded-xl p-2 pr-7"
        >
          {file.kind === 'image' ? (
            <img src={file.url} alt={file.name} className="h-10 w-10 rounded-lg object-cover" />
          ) : (
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-aura-gradient/20">
              {file.kind === 'pdf' ? <FileText size={18} /> : <FileIcon size={18} />}
            </div>
          )}
          <div className="max-w-[9rem]">
            <p className="truncate text-xs font-medium">{file.name}</p>
            <p className="text-[10px] text-current/50">{formatBytes(file.size)}</p>
          </div>
          <button
            onClick={() => onRemove(file.id)}
            aria-label={`Remove ${file.name}`}
            className="absolute right-1.5 top-1.5 rounded-full bg-black/30 p-0.5 hover:bg-black/50"
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}
