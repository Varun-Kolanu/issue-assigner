import { describe, test } from "node:test";
import assert from "node:assert";
import { checkConfig } from "../../src/helpers/check_config.js";
import replacePlaceholders from "../../src/helpers/replace_name.js";

describe("Configuration Validation and Placeholder Replacement", () => {
  let config;
  test("throws error if config file is empty", () => {
    config = {};
    assert.throws(
      () => {
        checkConfig(config);
      },
      { message: "Configuration file issue-assigner.yml is empty" }
    );
  });

  test("throws error if config file doesn't contain name key", () => {
    config = { "some-key": "some-value" };
    assert.throws(
      () => {
        checkConfig(config);
      },
      { message: "'name' key is missing in issue-assigner.yml" }
    );
  });

  test("replaces {name} placeholder in string values", () => {
    config = { some_key: "{name} some-comment" };
    assert.deepEqual(replacePlaceholders(config, "test-name"), {
      some_key: "test-name some-comment",
    });
  });

  test("replaces {name} placeholder in array values", () => {
    config = { some_key: ["{name} test"] };
    assert.deepEqual(replacePlaceholders(config, "test-name"), {
      some_key: ["test-name test"],
    });
  });

  test("replaces {name} placeholder in object values", () => {
    config = { some_key: { some_deep: "{name} test" } };
    assert.deepEqual(replacePlaceholders(config, "test-name"), {
      some_key: { some_deep: "test-name test" },
    });
  });
});
