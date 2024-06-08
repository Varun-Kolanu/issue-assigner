export const getConfig = async function (context) {
  // Load the configuration
  const config = await context.config("issue-assigner.yml");

  // Check if config and name key exists
  if (!config || !config.name) {
    throw new Error(
      "Configuration or 'name' key is missing in issue-assigner.yml"
    );
  }

  const name = config.name;

  // Helper function to recursively replace {name} in all string values in an object
  const replacePlaceholders = (obj, name) => {
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
  };

  // Perform the replacement in the config object
  const updatedConfig = replacePlaceholders(config, name);

  return updatedConfig;
};
