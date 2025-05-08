import React from "react";
import Image from "next/image";

interface InfoScreenProps {
  imgUrl: string;
  imgHeight?: number;
  imgWidth?: number;
  title: string;
  subtitle: string;
}

function InfoScreen({ 
  imgUrl, 
  imgHeight = 420, 
  imgWidth = 420, 
  title, 
  subtitle 
}: InfoScreenProps) {
  return (
    <div>
      <div className="flex flex-col justify-center items-center gap-8">
        <Image
          className=""
          src={imgUrl}
          height={imgHeight}
          width={imgWidth}
          alt={`${title} image`}
        />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-black text-2xl font-bold">{title}</h2>
        <p className="text-slate-600">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export default InfoScreen;