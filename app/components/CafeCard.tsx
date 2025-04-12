// components/CafeCard.tsx
'use client';
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { capitalize } from "@/app/utils/capitalize";
import { Cafe } from "../types";

interface CafeCardProps {
  cafe: Cafe;
  onSelect: (cafe: Cafe) => void;
}

export const CafeCard = ({ cafe, onSelect }: CafeCardProps) => (
  <div className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-2xl hover:scale-105 transition-all cursor-pointer">
    <Carousel
      infiniteLoop
      autoPlay
      showThumbs={false}
      showStatus={false}
      showIndicators={false}
    >
      {cafe.images_url.map((url, index) => (
        <div key={index} className="relative h-64">
          <img
            src={url}
            alt={cafe.club_name}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black p-4"
            onClick={() => onSelect(cafe)}
          >
            <h3 className="text-2xl font-bold text-white">{capitalize(cafe.club_name)}</h3>
            <p className="text-purple-300 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {`${capitalize(cafe.location?.address)}, ${capitalize(cafe.location?.city)}, ${capitalize(cafe.location?.state)}, ${capitalize(cafe.location?.country)}`}
            </p>
          </div>
        </div>
      ))}
    </Carousel>
  </div>
);