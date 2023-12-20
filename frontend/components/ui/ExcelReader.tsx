import React, { useCallback, useRef, useState } from "react";
import * as XLSX from "xlsx";

type Props = {
  onFileUploaded: (
    data: any[][],
    sheetName: string,
    address: any,
    location: any
  ) => void;
  supportedWorksheetNames?: string[];
};

const ExcelReader: React.FC<Props> = ({
  onFileUploaded,
  supportedWorksheetNames,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = useCallback(
    async (file: File) => {
      setIsProcessing(true);
      try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });

        const jsonSynthese: any[][] = XLSX.utils.sheet_to_json(
          workbook.Sheets["synthese"],
          {
            header: 1,
          }
        );
        const address: string = jsonSynthese[0][1];
        const location: string = jsonSynthese[1][1];
        const location_latitude: number = parseFloat(location.split(",")[0]);
        const location_longitude: number = parseFloat(location.split(",")[1]);
        workbook.SheetNames.forEach((sheetName) => {
          console.log("Handling sheet:", sheetName);
          if (
            supportedWorksheetNames &&
            !supportedWorksheetNames.includes(sheetName)
          ) {
            console.log("Skipping unsupported sheet:", sheetName);
            return;
          }
          const worksheet = workbook.Sheets[sheetName];
          console.log("Worksheet:", worksheet);
          const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
          });
          onFileUploaded(jsonData, sheetName, address, [
            location_latitude,
            location_longitude,
          ]);
        });
      } catch (error) {
        console.error("Error reading file:", error);
        // Handle the error according to your needs
      } finally {
        setIsProcessing(false);
      }
    },
    [onFileUploaded, supportedWorksheetNames]
  );

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`border border-dashed border-lgray rounded-xl p-10 text-center cursor-pointer ${
        isProcessing ? "bg-lgray" : ""
      }`}
      onClick={!isProcessing ? triggerFileInput : undefined}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
    >
      {isProcessing ? (
        <p>Processing...</p>
      ) : (
        "Drag and drop a file here, or click to select a file"
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ExcelReader;
