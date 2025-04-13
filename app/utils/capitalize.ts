export const capitalize = (str: string) =>
    str
      ? str
        ?.split(" ")
        ?.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ")
      : "";