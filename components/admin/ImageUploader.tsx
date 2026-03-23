'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { UploadCloud, X, AlertCircle, ImageOff } from 'lucide-react'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB
const MAX_IMAGES = 5

interface ImageUploaderProps {
  value: string[]              // current blob URLs stored in form state
  onChange: (urls: string[]) => void
}

interface UploadingFile {
  id: string                   // temp local ID
  previewUrl: string           // local object URL for instant preview
  progress: number             // 0–100
  error?: string
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState<UploadingFile[]>([])

  // Upload a single file — returns the blob URL or throws
  const uploadFile = async (
    file: File,
    tempId: string
  ): Promise<string> => {
    // Client-side validation
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Only JPEG, PNG and WebP images are supported.')
    }
    if (file.size > MAX_SIZE_BYTES) {
      throw new Error('File exceeds the 5MB size limit.')
    }

    const formData = new FormData()
    formData.append('file', file)

    // Simulate progress increments while the upload runs
    let simulatedProgress = 10
    const progressInterval = setInterval(() => {
      simulatedProgress = Math.min(simulatedProgress + 15, 85)
      setUploading((prev) =>
        prev.map((u) =>
          u.id === tempId ? { ...u, progress: simulatedProgress } : u
        )
      )
    }, 300)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Upload failed')
      }

      const { url } = await res.json()

      // Mark as complete
      setUploading((prev) =>
        prev.map((u) => (u.id === tempId ? { ...u, progress: 100 } : u))
      )

      return url as string
    } catch (error) {
      clearInterval(progressInterval)
      throw error
    }
  }

  const processFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const remaining = MAX_IMAGES - value.length - uploading.length

    if (remaining <= 0) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed.`)
      return
    }

    const toProcess = fileArray.slice(0, remaining)

    if (fileArray.length > remaining) {
      toast.warning(
        `Only ${remaining} more image${remaining !== 1 ? 's' : ''} can be added.`
      )
    }

    // Add all files to uploading state with instant previews
    const newUploading: UploadingFile[] = toProcess.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
    }))

    setUploading((prev) => [...prev, ...newUploading])

    // Upload each file concurrently
    await Promise.all(
      toProcess.map(async (file, i) => {
        const tempId = newUploading[i].id
        try {
          const blobUrl = await uploadFile(file, tempId)

          // Add blob URL to form state and remove from uploading
          onChange([...value, blobUrl])
          setUploading((prev) => prev.filter((u) => u.id !== tempId))

          // Revoke the local object URL to free memory
          URL.revokeObjectURL(newUploading[i].previewUrl)
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Upload failed'
          setUploading((prev) =>
            prev.map((u) =>
              u.id === tempId ? { ...u, error: message, progress: 0 } : u
            )
          )
          toast.error(`Failed to upload ${file.name}`, {
            description: message,
          })
        }
      })
    )
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      processFiles(e.target.files)
      // Reset input so the same file can be re-selected after an error
      e.target.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files?.length) processFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const removeImage = (url: string) => {
    onChange(value.filter((u) => u !== url))
  }

  const removeUploading = (id: string) => {
    setUploading((prev) => {
      const item = prev.find((u) => u.id === id)
      if (item) URL.revokeObjectURL(item.previewUrl)
      return prev.filter((u) => u.id !== id)
    })
  }

  const totalCount = value.length + uploading.length
  const canAddMore = totalCount < MAX_IMAGES

  return (
    <div className="space-y-3">

      {/* Drop zone */}
      {canAddMore && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-zinc-50'
          )}
          role="button"
          tabIndex={0}
          aria-label="Upload product images"
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        >
          <div className="p-3 bg-primary/10 rounded-full">
            <UploadCloud className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Drop images here or{' '}
              <span className="text-primary underline">browse</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              JPEG, PNG or WebP — max 5MB each — up to {MAX_IMAGES} images
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={handleFileInput}
            aria-hidden="true"
          />
        </div>
      )}

      {/* Image grid — committed uploads + in-progress uploads */}
      {(value.length > 0 || uploading.length > 0) && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">

          {/* Committed blob URLs */}
          {value.map((url, i) => (
            <div
              key={url}
              className="relative aspect-square rounded-lg overflow-hidden bg-zinc-100 group"
            >
              <Image
                src={url}
                alt={`Product image ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 33vw, 20vw"
              />
              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 h-6 w-6 bg-black/60 hover:bg-destructive rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Remove image ${i + 1}`}
              >
                <X className="h-3.5 w-3.5 text-white" />
              </button>
              {/* Primary badge */}
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-[10px] font-bold bg-primary text-white px-1.5 py-0.5 rounded">
                  Main
                </span>
              )}
            </div>
          ))}

          {/* In-progress uploads */}
          {uploading.map((item) => (
            <div
              key={item.id}
              className="relative aspect-square rounded-lg overflow-hidden bg-zinc-100"
            >
              {/* Preview */}
              {!item.error && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.previewUrl}
                  alt="Uploading preview"
                  className="w-full h-full object-cover opacity-60"
                />
              )}

              {/* Error state */}
              {item.error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-destructive/10 p-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <p className="text-[10px] text-destructive text-center leading-tight line-clamp-2">
                    {item.error}
                  </p>
                </div>
              )}

              {/* Progress overlay */}
              {!item.error && item.progress < 100 && (
                <div className="absolute inset-0 flex flex-col items-end justify-end p-2 bg-black/20">
                  <Progress
                    value={item.progress}
                    className="h-1.5 w-full bg-white/30"
                  />
                </div>
              )}

              {/* Remove errored / stuck upload */}
              {item.error && (
                <button
                  type="button"
                  onClick={() => removeUploading(item.id)}
                  className="absolute top-1 right-1 h-6 w-6 bg-black/60 rounded-full flex items-center justify-center"
                  aria-label="Remove failed upload"
                >
                  <X className="h-3.5 w-3.5 text-white" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* No images placeholder */}
      {value.length === 0 && uploading.length === 0 && !canAddMore && (
        <div className="flex flex-col items-center justify-center gap-2 py-6 text-zinc-400">
          <ImageOff className="h-8 w-8" />
          <p className="text-sm">No images uploaded yet</p>
        </div>
      )}

      {/* Count indicator */}
      {totalCount > 0 && (
        <p className="text-xs text-muted-foreground">
          {value.length} of {MAX_IMAGES} images uploaded
          {!canAddMore && (
            <span className="ml-1 text-orange-500 font-medium">
              (maximum reached)
            </span>
          )}
        </p>
      )}
    </div>
  )
}
