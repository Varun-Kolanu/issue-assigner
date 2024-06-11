// Helper function to recursively replace {name} in all string values in an object
export default function replacePlaceholders(obj, name) {
  const replacer = (str) => str.replace(/{name}/g, name);

  if (typeof obj === "string") {
    return replacer(obj);
  } else if (Array.isArray(obj)) {
    return obj.map((item) => replacePlaceholders(item, name));
  } else if (typeof obj === "object" && obj !== null) {
    const newObj = {};
    for (const key in obj) {
      newObj[key] = replacePlaceholders(obj[key], name);
    }
    return newObj;
  }
  return obj;
}
