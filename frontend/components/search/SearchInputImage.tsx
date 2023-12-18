import { useRef } from "react";
import { CameraIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import toast from "react-hot-toast";

const MAX_IMAGE_SIZE_MB = 5.0;

const SearchInputImage = ({
  queryImage,
  onImageChange,
  onImageRemove,
}: {
  queryImage: string | undefined;
  onImageChange: (image: string) => void;
  onImageRemove: () => void;
}) => {
  const imageUploadRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const isJpeg = file.type === "image/jpeg";

      if (!isJpeg) {
        toast.error("Only JPEG images are allowed.");
      } else if (file.size / 1024 / 1024 >= MAX_IMAGE_SIZE_MB) {
        toast.error(`File size must be smaller than ${MAX_IMAGE_SIZE_MB} MB`);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          onImageChange(event.target?.result as string);
        };
        reader.onerror = () => {
          toast.error("An error occurred while reading the file");
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <>
      {queryImage ? (
        <div
          className="flex relative cursor-pointer bg-orange/20 border border-orange/30 items-center rounded-lg px-1.5"
          onClick={onImageRemove}
        >
          <div className="mr-3 flex items-center">
            <XMarkIcon className="w-5 mr-1" />
            <p className="text-sm pt-0.5 font-body-500">Photo</p>
          </div>
          <div className="relative h-[38px] w-[38px] flex items-center">
            <Image
              src={queryImage}
              fill
              className="rounded-lg"
              alt="Image uploaded by user"
            />
          </div>
        </div>
      ) : (
        <button
          className="w-14 rounded-lg border border-black border-dashed bg-dbeige/5 shadow-sm flex items-center justify-center content-center"
          onClick={() => imageUploadRef.current?.click()}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={imageUploadRef}
            onChange={handleImageUpload}
          />
          <CameraIcon className="w-1/2 stroke-dbeige/60" />
        </button>
      )}
    </>
  );
};

export default SearchInputImage;
