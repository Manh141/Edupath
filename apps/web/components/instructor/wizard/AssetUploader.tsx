"use client";

import { useRef, useState } from "react";
import { Loader2, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export type UploadHandler = (
  file: File,
  opts: { onProgress: (loaded: number, total: number) => void },
) => Promise<unknown>;

export function AssetUploader({
  label,
  description,
  accept,
  maxBytes,
  disabled,
  previewUrl,
  previewKind = "image",
  onUpload,
  onRemove,
}: {
  label: string;
  description?: string;
  accept: string;
  maxBytes: number;
  disabled?: boolean;
  previewUrl?: string | null;
  previewKind?: "image" | "video";
  onUpload: UploadHandler;
  onRemove?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setProgress(0);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);

    if (file.size > maxBytes) {
      setError(
        `File is ${(file.size / 1024 / 1024).toFixed(1)} MB. Max allowed: ${(
          maxBytes /
          1024 /
          1024
        ).toFixed(0)} MB.`,
      );
      reset();
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      await onUpload(file, {
        onProgress: (loaded, total) =>
          setProgress(Math.round((loaded / total) * 100)),
      });
      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      reset();
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </div>

      {previewUrl ? (
        <div className="relative overflow-hidden rounded-xl border border-border bg-secondary/40">
          {previewKind === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt={label}
              className="aspect-video w-full object-cover"
            />
          ) : (
            <video
              src={previewUrl}
              controls
              className="aspect-video w-full bg-black"
            />
          )}
          {onRemove && !disabled && (
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute right-2 top-2 h-8 w-8"
              onClick={onRemove}
              aria-label="Remove asset"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div className="flex aspect-video items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary/20">
          <div className="text-center text-xs text-muted-foreground">
            <UploadCloud className="mx-auto mb-2 h-6 w-6" />
            No file uploaded yet
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleChange}
          disabled={disabled || isUploading}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || isUploading}
        >
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <UploadCloud className="mr-2 h-4 w-4" />
          )}
          {previewUrl ? "Replace file" : "Upload file"}
        </Button>
        <p className="text-xs text-muted-foreground">
          {accept} · max {(maxBytes / 1024 / 1024).toFixed(0)} MB
        </p>
      </div>

      {isUploading && (
        <div className="space-y-1">
          <Progress value={progress} />
          <p className="text-xs text-muted-foreground">Uploading… {progress}%</p>
        </div>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
