import Cafe  from "@/app/schema/cafe-schema"; // Assume Cafe is your Mongoose model

// Function to fetch a cafe by its ID
export const fetchCafeById = async (cafeId: string) => {
  try {
    const cafe = await Cafe.findById(cafeId).populate("menuItems"); // Assuming `menuItems` is a reference to a Menu model
    if (!cafe) {
      throw new Error("Cafe not found");
    }
    return cafe;
  } catch (error) {
    throw new Error("Error fetching cafe: " + (error instanceof Error ? error.message : "Unknown error"));
  }
};
