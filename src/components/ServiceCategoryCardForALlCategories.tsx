import React from "react";
import Image from "next/image";

interface Props {
  iconSrc: string;
  bgColor: string;
  imageAltText: string;
  text: string;
  height: number;
  width: number;
}

const ServiceCard: React.FC<Props> = ({
  iconSrc,
  bgColor,
  imageAltText,
  text,
}) => {
  return (
    <div className="h-full w-full flex flex-col items-center">
      <div
        style={{ backgroundColor: bgColor }}
        className="w-full aspect-square rounded-full flex justify-center items-center overflow-hidden"
      >
        <div className="w-full h-full relative">
          <Image 
            src={iconSrc} 
            alt={imageAltText}
            fill
            sizes="(max-width: 1000px) 100vw, 50vw"
            className="object-cover"
            style={{ objectPosition: 'center' }}
          />
        </div>
      </div>
      <p className="text-lg mt-2 text-center">{text}</p>
    </div>
  );
};

export default ServiceCard;