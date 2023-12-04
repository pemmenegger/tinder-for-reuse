import React, { useCallback, useRef, useState } from "react";
import * as XLSX from "xlsx";

type Props = {
  onFileUploaded: (lat: number, lng: number, data: any[][]) => void;
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

        // go to synthese sheet and extract lat lng
        let synthese =
          workbook.Sheets["synthese"] ||
          workbook.Sheets["Synthese"] ||
          workbook.Sheets["SYNTHESE"];
        if (!synthese) {
          console.error("synthese sheet not found");
          return;
        }

        const jsonData: any[][] = XLSX.utils.sheet_to_json(synthese, {
          header: 1,
        });
        const lat = jsonData[1][0].split(",")[0];
        const lng = jsonData[1][0].split(",")[1];
        if (!lat || !lng) {
          console.error("lat lng not found");
          return;
        }
        console.log(lat, lng);

        workbook.SheetNames.forEach((sheetName) => {
          if (
            supportedWorksheetNames &&
            !supportedWorksheetNames.includes(sheetName)
          ) {
            return;
          }
          const worksheet = workbook.Sheets[sheetName];
          const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
          });
          onFileUploaded(lat, lng, jsonData);
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
