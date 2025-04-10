import React, { useState } from 'react';
import { uploadImage } from '@/app/api/uploadApi';
import { FiUpload, FiX } from 'react-icons/fi';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
}

export default function ImageUpload({ onImageUploaded }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    try {
      setUploading(true);
      const response = await uploadImage(file);
      onImageUploaded(response.data.data.url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        id="image-upload"
        disabled={uploading}
      />
      <label
        htmlFor="image-upload"
        className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-red-500 transition-colors"
      >
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="max-h-48 rounded" />
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
          </div>
        ) : (
          <>
            <FiUpload className="w-8 h-8 mb-2 text-gray-400" />
            <p className="text-sm text-gray-500">Click to upload image</p>
          </>
        )}
      </label>
    </div>
  );
}