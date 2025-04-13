'use client';
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { capitalize } from "@/app/utils/capitalize";
import { Cafe } from "../types";

interface CafeCardProps {
    cafe: Cafe;
    onSelect: (cafe: Cafe) => void;
}

export const CafeCard = ({ cafe, onSelect }: CafeCardProps) => {
    const startingPrice = cafe?.menuItems?.reduce(
        (min, item) => Math.min(min, item.price),
        Infinity
    ) ?? null;

    return (
        <div
            className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer border border-gray-700/50 hover:border-purple-400/30 group"
            
        >
            <Carousel
                infiniteLoop
                autoPlay
                showThumbs={false}
                showStatus={false}
                showIndicators={true}
                interval={5000}
                className="aspect-[3/4] sm:aspect-[4/3]"
                renderIndicator={(onClickHandler, isSelected, index, label) => (
                    <div
                        className={`inline-block w-2 h-2 mx-1 rounded-full shadow-sm ${isSelected ? 'bg-purple-400' : 'bg-gray-500'
                            }`}
                        aria-label={label}
                        onClick={onClickHandler}
                    />
                )}
            >
                {cafe?.images_url?.map((url, index) => (
                    <div key={index} className="relative h-full">
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
                        <img
                            src={url}
                            alt={cafe.club_name}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                        />

                        {/* Info Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-5 space-y-3 backdrop-blur-sm bg-gradient-to-t from-black/90 via-black/70 to-transparent"
                        onClick={() => onSelect(cafe)}
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
                                    {capitalize(cafe.club_name)}
                                </h3>

                                {startingPrice !== null && (
                                    <div className="relative inline-flex items-center px-3 py-1.5 rounded-full bg-gray-900/70 backdrop-blur-md border border-white/10 group-hover:border-cyan-300/30 transition-all shadow-lg shadow-cyan-500/10">
                                        <div className="absolute -inset-1 -z-10 bg-gradient-to-r from-cyan-400/10 to-purple-500/10 rounded-full blur-sm opacity-60"></div>
                                        <span className="text-[0.7rem] font-medium tracking-wider text-cyan-300/80 mr-1.5">FROM</span>
                                        <span className="text-sm font-bold text-white flex items-center">
                                            <span className="text-cyan-300 mr-1">₹</span>
                                            {startingPrice.toLocaleString()}
                                        </span>
                                        <div className="w-1 h-1 ml-2 rounded-full bg-cyan-400/80 animate-pulse"></div>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-start">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2 mt-0.5 text-purple-400 flex-shrink-0"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <div>
                                    <p className="text-sm font-semibold text-white">
                                        {capitalize(cafe.location?.city)}
                                    </p>
                                    <p className="text-xs text-gray-300/80 line-clamp-2">
                                        {`${capitalize(cafe.location?.address)}, ${capitalize(
                                            cafe.location?.city
                                        )}`}
                                    </p>

                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
            <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/40 transition-opacity"
            onClick={() => onSelect(cafe)}
            >
                <span className="px-4 py-2 rounded-full bg-purple-400/10 border border-purple-400/20 text-purple-300 font-semibold text-sm backdrop-blur-sm">
                    View Details →
                </span>
            </div>
        </div>
    );
};