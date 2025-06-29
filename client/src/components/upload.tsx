import { useRef, useState } from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { File as FileIcon, Trash2 } from "lucide-react";

interface FileUploadProps {
  value?: string;
  onChange: (url: string) => void;
  resetOnDelete?: boolean;
  label?: string;
  accept?: string; // ví dụ: "application/pdf,image/*"
  selectedFile?: File | null;
  onFileSelect: (file: File | null) => void;
  onUpload?: () => Promise<void>;
  isProcessed?: boolean; // New prop to indicate if file is processed
}

export const FileUpload = ({
  onChange,
  label,
  accept = "*",
  selectedFile,
  onFileSelect,
  isProcessed = false,
}: FileUploadProps) => {
  const [uploading, ] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onFileSelect(file || null);
  };




  return (
    <div className="w-full h-full">
      {label && (
        <Label className="mb-4 block text-lg font-semibold">{label}</Label>
      )}

      {!isProcessed && !selectedFile ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300 group cursor-pointer min-h-[400px] flex flex-col items-center justify-center"
          onClick={() => inputRef.current?.click()}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
            <FileIcon className="h-10 w-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Drop your files here
          </h3>
          <p className="text-gray-600 mb-2">
            or click to browse from your device
          </p>

          <Button
            type="button"
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={uploading}
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
          >
            <FileIcon className="mr-2 h-5 w-5" />
            Choose Files
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>
      ) : selectedFile && !isProcessed ? (
        // File selected but not uploaded yet
        <div className="border-2 border-solid border-blue-300 rounded-2xl p-12 text-center bg-blue-50/30 min-h-[400px] flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileIcon className="h-10 w-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            File Selected
          </h3>
          <p className="text-gray-600 mb-2">{selectedFile.name}</p>
          <p className="text-sm text-gray-500 mb-6">
            File size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                onFileSelect(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Trash2 className="mr-2 h-5 w-5" />
              Remove File
            </Button>
            <Button
              type="button"
              size="lg"
              onClick={() => inputRef.current?.click()}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <FileIcon className="mr-2 h-5 w-5" />
              Change File
            </Button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>
      ) : (
        // File processed successfully
        <div className="border-2 border-solid border-green-300 rounded-2xl p-12 text-center bg-green-50/30 min-h-[400px] flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileIcon className="h-10 w-10 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            File processed successfully!
          </h3>
          <p className="text-gray-600 mb-2">{selectedFile?.name || "File"}</p>
          <p className="text-gray-600 mb-6">
            Your file has been processed and is ready for generating notes
          </p>
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                onFileSelect(null);
                onChange("");
                if (inputRef.current) inputRef.current.value = "";
              }}
              disabled={uploading}
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              <Trash2 className="mr-2 h-5 w-5" />
              Remove File
            </Button>
            <Button
              type="button"
              size="lg"
              onClick={() => inputRef.current?.click()}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <FileIcon className="mr-2 h-5 w-5" />
              Change File
            </Button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>
      )}

      <div className="text-xs text-muted-foreground mt-4 text-center">
        <b>*Note:</b> Accepted formats: <b>{accept}</b>
      </div>
    </div>
  );
};
