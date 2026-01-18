import { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { PrimaryButton } from "./PrimaryButton";
import { IconButton } from "./IconButton";
import DeleteIcon from "../assets/svg/delete.svg";
import ChangeIcon from "../assets/svg/change.svg";
import ProfileIconBig from "../assets/svg/profilebig.svg";

interface AvatarInputProps {
  image: File | string | null;
  onChange: (file: File) => void;
  onRemove: () => void;
  
  // passing the ref up so the parent can trigger the "save canvas" logic
  editorRef: React.RefObject<AvatarEditor | null>; 
}

export const AvatarInput = ({ image, onChange, onRemove, editorRef }: AvatarInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scale, setScale] = useState(1.2);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5">
      <div className="flex flex-col items-center gap-2">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        {image && typeof image !== "string" ? (
          <div className="flex flex-col items-center">
            <AvatarEditor
              ref={editorRef}
              image={image}
              width={88}
              height={88}
              border={0}
              borderRadius={50}
              scale={scale}
            />
            <input
              type="range"
              min="1"
              max="2"
              step="0.01"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-20 h-1 mt-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        ) : (
          
        // default profile icon or existing image url
          <img
            src={(image as string) || ProfileIconBig}
            alt="Profile"
            className="w-22 h-22 object-cover border rounded-full border-residential-10"
          />
        )}
      </div>

      <div className="flex items-center gap-3">
        <PrimaryButton
          type="button"
          img={ChangeIcon}
          className=""
          onClick={() => fileInputRef.current?.click()}
        >
          <span className="hidden md:inline">Change picture</span>
          <span className="md:hidden">Change</span>
        </PrimaryButton>
        
        <IconButton
          variation="primary"
          icon={DeleteIcon}
          className=""
          onClick={onRemove}
          type="button"
        />
      </div>
    </div>
  );
};