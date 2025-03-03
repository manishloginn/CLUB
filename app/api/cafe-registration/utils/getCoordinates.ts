import NodeGeocoder from 'node-geocoder';
import fetch from 'node-fetch';



const options: NodeGeocoder.Options = {
    provider: 'openstreetmap', // Free alternative to Google Maps
    fetch
};


const geocoder = NodeGeocoder(options);

export async function getCoordinates( city: string, state:string, country: string) {
    try {
        const res = await geocoder.geocode(` ${city}, ${state}, ${country}`);
        
        if (res.length > 0) {
            return {
                latitude: res[0].latitude,
                longitude: res[0].longitude
            };
        } else {
            console.warn("No coordinates found for this address.");
        }

        return  {
            latitude: "N/A",
            longitude: "N/A"
        };
    } catch (error) {
        console.error('Error in geocoding:', error);
        return null;
    }
}