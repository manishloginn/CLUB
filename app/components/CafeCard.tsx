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
            {/* Aspect Ratio Fixed */}
            <div className="aspect-[5/6] sm:aspect-[4/3] relative">
                <Carousel
                    infiniteLoop
                    autoPlay
                    showThumbs={false}
                    showStatus={false}
                    showIndicators={true}
                    interval={5000}
                    className="h-full"
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
                        <div key={index} className="h-full">
                            {/* Force Aspect Ratio inside here */}
                            <div className="w-full h-full aspect-[5/6] sm:aspect-[4/3] relative">
                                <img
                                    src={url}
                                    alt={cafe.club_name}
                                    className="w-full h-full object-cover absolute inset-0 rounded-t-2xl"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
                            </div>
                        </div>
                    ))}
                </Carousel>

            </div>

            {/* Info Section */}
            <div className="p-4 sm:p-5 space-y-2 sm:space-y-3 bg-gradient-to-t from-black/90 via-black/70 to-transparent"
                onClick={() => onSelect(cafe)}
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
                        {capitalize(cafe.club_name)}
                    </h3>

                    {startingPrice !== null && (
                        <div className="relative inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-gray-900/70 backdrop-blur-md border border-white/10 group-hover:border-cyan-300/30 transition-all shadow-lg shadow-cyan-500/10">
                            <span className="text-[0.6rem] sm:text-[0.7rem] font-medium tracking-wider text-cyan-300/80 mr-1">FROM</span>
                            <span className="text-xs sm:text-sm font-bold text-white flex items-center">
                                <span className="text-cyan-300 mr-0.5 sm:mr-1">₹</span>
                                {startingPrice.toLocaleString()}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-start">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 mt-0.5 text-purple-400 flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <div className="truncate">
                        <p className="text-xs sm:text-sm font-semibold text-white truncate">
                            {capitalize(cafe.location?.city)}
                        </p>
                        <p className="text-[0.65rem] sm:text-xs text-gray-300/80 line-clamp-1 sm:line-clamp-2">
                            {`${capitalize(cafe.location?.address)}, ${capitalize(
                                cafe.location?.city
                            )}`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/40 transition-opacity"
                onClick={() => onSelect(cafe)}
            >
                <span className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-purple-400/10 border border-purple-400/20 text-purple-300 font-semibold text-xs sm:text-sm backdrop-blur-sm">
                    View Details →
                </span>
            </div>
        </div>
    );
};
