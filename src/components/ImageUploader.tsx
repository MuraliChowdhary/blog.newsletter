'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Upload, Image as ImageIcon, Video, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  onUploadSuccess: (url: string, publicId: string) => void;
  onUploadError: (error: string) => void;
  currentImageUrl?: string;
  onRemoveImage?: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onUploadSuccess, 
  onUploadError, 
  currentImageUrl,
  onRemoveImage 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      onUploadError('Please select a file first.');
      return;
    }

    setLoading(true);
    onUploadError('');

    try {
      let resourceType = 'auto';
      if (file.type.startsWith('image/')) {
        resourceType = 'image';
      } else if (file.type.startsWith('video/')) {
        resourceType = 'video';
      }

      // 1. Get a signed URL from your Cloudflare Hono API
      const signatureResponse = await fetch('https://backend.muralisudireddy0.workers.dev/api/v1/user/imageupload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          folder: 'nextjs_uploads', // This parameter is used for signing
          // *** FIX HERE: DO NOT send resource_type to the backend for signing ***
          // resource_type: resourceType, // <--- REMOVE THIS LINE
        }),
      });
      
      if (!signatureResponse.ok) {
        const errorData = await signatureResponse.json();
        throw new Error(errorData.error || 'Failed to get Cloudinary signature');
      }
      
      const { timestamp, signature, cloudname, api_key } = await signatureResponse.json();

      // 2. Prepare FormData for Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', api_key); // Use API key from backend response
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('folder', 'nextjs_uploads');
      // Append the resource_type to formData for Cloudinary
      formData.append('resource_type', resourceType);

      // 3. Upload to Cloudinary
      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudname}/${resourceType}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!cloudinaryResponse.ok) {
        const errorData = await cloudinaryResponse.json();
        throw new Error(errorData.error?.message || 'Cloudinary upload failed.');
      }

      const data = await cloudinaryResponse.json();
      console.log('Cloudinary upload data:', data);

      const mediaUrl = data.secure_url;
      const publicId = data.public_id;

      onUploadSuccess(mediaUrl, publicId);
      setFile(null);
      setPreviewUrl(null);
    } catch (error: any) {
      console.error('Upload error:', error);
      onUploadError(error.message || 'An unexpected error occurred during upload.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCurrentImage = () => {
    if (onRemoveImage) {
      onRemoveImage();
    }
  };

  const isVideo = (url: string) => {
    return url.includes('video/') || url.includes('.mp4') || url.includes('.mov') || url.includes('.webm');
  };

  return (
    <div className="space-y-4">
      {/* Current Image Display */}
      {currentImageUrl && (
        <div className="relative">
          <div className="border rounded-lg overflow-hidden">
            {isVideo(currentImageUrl) ? (
              <video 
                src={currentImageUrl} 
                controls 
                className="w-full h-48 object-cover"
              />
            ) : (
              <img 
                src={currentImageUrl} 
                alt="Current featured media" 
                className="w-full h-48 object-cover"
              />
            )}
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemoveCurrentImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Upload Section */}
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            {file?.type.startsWith('video/') ? (
              <Video className="h-12 w-12 text-muted-foreground" />
            ) : (
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            )}
          </div>
          
          <div>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </label>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Upload images or videos (JPG, PNG, GIF, MP4, MOV, WebM)
          </p>
        </div>

        {/* Preview */}
        {previewUrl && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Preview:</p>
            <div className="border rounded-lg overflow-hidden">
              {file?.type.startsWith('video/') ? (
                <video 
                  src={previewUrl} 
                  controls 
                  className="w-full h-48 object-cover"
                />
              ) : (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-48 object-cover"
                />
              )}
            </div>
          </div>
        )}

        {/* Upload Button */}
        {file && (
          <div className="mt-4">
            <Button
              type="button"
              onClick={handleUpload}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload to Cloudinary
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;