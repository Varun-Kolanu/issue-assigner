export const checkConfig = (config) => {
  // Check if config and name key exists
  if (!config || Object.keys(config).length === 0) {
    throw new Error("Configuration file issue-assigner.yml is empty");
  } else if (!config.name) {
    throw new Error("'name' key is missing in issue-assigner.yml");
  }
};
