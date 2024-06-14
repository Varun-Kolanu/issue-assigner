import axios from "axios";
import { checkConfig } from "./check_config.js";
import replacePlaceholders from "./replace_name.js";

export const getConfig = async function (context) {
  // Load the configuration
  const config = await context.config("issue-assigner.yml");
  checkConfig(config);

  const name = config.name;
  // Perform the replacement in the config object
  const updatedConfig = replacePlaceholders(config, name);

  return updatedConfig;
};
