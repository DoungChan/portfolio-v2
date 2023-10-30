import React from "react";

interface CustomAvatarProps {
  imageUrl: string;
  altText: string;
  sizeWidth?: number;
  sizeHeight?: number;
}

const CustomAvatar: React.FC<CustomAvatarProps> = ({
  imageUrl,
  altText,
  sizeWidth,
  sizeHeight,
}) => {
  return (
    <img
      src={imageUrl}
      alt={altText}
      style={{ width: sizeWidth, height: sizeHeight, borderRadius: "5%" }}
      className="object-cover"
    />
  );
};

export default CustomAvatar;
