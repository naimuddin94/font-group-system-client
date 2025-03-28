import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { HiOutlineCloudUpload } from "react-icons/hi";
import Container from "./Container";

export default function TTFFileUploader() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.name.endsWith(".ttf")) {
      setFile(selectedFile);
    } else if (selectedFile) {
      alert("Only TTF files are allowed");
      e.target.value = "";
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.name.endsWith(".ttf")) {
      setFile(droppedFile);
    } else if (droppedFile) {
      alert("Only TTF files are allowed");
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  console.log(file);

  return (
    <Container>
      <div
        className={`w-full max-w-3xl mx-auto border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-gray-400"
        } h-[130px] sm:h-[170px] md:h-[200px]`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".ttf"
          onChange={handleFileChange}
        />

        {file ? (
          <div className="flex flex-col items-center gap-2 text-center px-4">
            <HiOutlineCloudUpload className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />

            <p className="text-gray-700 font-medium text-sm sm:text-base break-all max-w-full">
              {file.name}
            </p>
            <p className="text-gray-500 text-xs sm:text-sm">
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
        ) : (
          <>
            <HiOutlineCloudUpload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            <p className="text-gray-500  text-sm sm:text-base">
              <span className="font-medium">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-gray-400 text-xs sm:text-sm">
              Only TTF File Allowed
            </p>
          </>
        )}
      </div>
    </Container>
  );
}
