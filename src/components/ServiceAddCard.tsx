"use client";

import React, { useEffect } from "react";
import Image from "next/image";

interface ServiceAddCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageURL: string;
  onItemCountChange: (id: string, count: number) => void;
}

function ServiceAddCard({ id, name, description, price, imageURL, onItemCountChange }: ServiceAddCardProps) {
  const [itemAdded, setItemAdded] = React.useState(false);
  const [itemCount, setItemCount] = React.useState(0);

  useEffect(() => {
    onItemCountChange(id, itemCount);
  }, [itemCount, onItemCountChange, id]);

  const clickHandler = () => {
    setItemAdded(!itemAdded);
    if (!itemAdded) {
      setItemCount(1);
    } else {
      setItemCount(0);
      setItemAdded(false);
    }
  };

  const posCountHandler = () => {
    setItemCount((prevCount) => prevCount + 1);
  };

  const negClickHandler = () => {
    setItemCount((prevCount) => {
      const newCount = prevCount - 1;
      if (newCount <= 0) {
        setItemAdded(false);
        return 0;
      }
      return newCount;
    });
  };

  // Calculate the original price (used for showing strikethrough price)
  const originalPrice = Math.round(price * 1.67); // Approximately 67% more than the discounted price

  return (
    <div className="h-full w-full flex justify-between">
      <div className="relative w-40 h-32 bg-gray-400 rounded-lg">
        <Image
          src={imageURL}
          alt={`${name} Service`}
          fill
          className="object-cover object-center rounded-lg"
        />
      </div>

      <div className="h-full w-full flex flex-col justify-start px-4 gap-2 py-2">
        <h3 className="font-semibold">{name}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
        <div className="h-full w-full flex justify-between items-center">
          <div className="">
            <p className="text-gray-500 inline-block">Starts from</p>
            <br />
            <div className="p-2 mt-2 rounded-xl font-bold inline-block">
              <span className="text-red-500 line-through">₹{originalPrice}</span>
              <span className="text-green-600 text-lg"> ₹{price}</span>
            </div>
          </div>

          {itemAdded ? (
            <div className="border-2 py-2 px-6 border-lightpurple bg-lightpurple text-white rounded-2xl flex gap-4 font-bold">
              <button onClick={negClickHandler}>-</button>
              {itemCount}
              <button onClick={posCountHandler}>+</button>
            </div>
          ) : (
            <button
              onClick={clickHandler}
              className="border-2 py-2 px-6 border-lightpurple text-lightpurple rounded-2xl font-semibold"
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServiceAddCard;