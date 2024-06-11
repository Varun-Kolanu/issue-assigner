import { describe, test } from "node:test";
import assert from "node:assert";
import { checkConfig } from "../../src/helpers/check_config.js";
import replacePlaceholders from "../../src/helpers/replace_name.js";

describe("If Config", () => {
  let config;
  test("is empty, throws error", () => {
    config = {};
    assert.throws(
      () => {
        checkConfig(config);
      },
      { message: "Configuration file issue-assigner.yml is empty" }
    );
  });

  test("doesn't contain name key, throws error", () => {
    config = { "some-key": "some-value" };
    assert.throws(
      () => {
        checkConfig(config);
      },
      { message: "'name' key is missing in issue-assigner.yml" }
    );
  });

  test("has {name} in string, it is replaced", () => {
    config = { some_key: "{name} some-comment" };
    assert.deepEqual(replacePlaceholders(config, "test-name"), {
      some_key: "test-name some-comment",
    });
  });

  test("has {name} in array, it is replaced", () => {
    config = { some_key: ["{name} test"] };
    assert.deepEqual(replacePlaceholders(config, "test-name"), {
      some_key: ["test-name test"],
    });
  });

  test("has {name} in object, it is replaced", () => {
    config = { some_key: { some_deep: "{name} test" } };
    assert.deepEqual(replacePlaceholders(config, "test-name"), {
      some_key: { some_deep: "test-name test" },
    });
  });
});
