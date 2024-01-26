const createParams = require("./params/create.json");
const updateParams = require("./params/update.json");
const { getDapp, getDapps, createDapp, updateDapp } = require("../dist/cjs");
const assert = require("assert");

let dappId;

describe("getDapp", () => {
  test("getDappByDappId", async () => {
    const res = await getDapp("74d47474-89b0-45eb-940b-73d7f31ca41c");
    console.log(res);
  });
});

describe("getDapps", () => {
  test("getDapps", async () => {
    const res = await getDapps();
    console.log(res);
  });

  test("getDappsByParams", async () => {
    const address = "0x13a6D1fe418de7e5B03Fb4a15352DfeA3249eAA4";
    const limit = 1;
    const offset = 0;
    const res = await getDapps({ address, limit, offset });
    console.log(res);
  });
});

describe("createDapp", () => {
  test("createDapp", async () => {
    const { id, name } = await createDapp(createParams);
    dappId = id;
    assert(name === createParams.input.name);
  });
});

describe("updateDapp", () => {
  test("updateDapp", async () => {
    const { name, models } = await updateDapp({
      dappId,
      ...updateParams,
    });
    assert(name === updateParams.input.name);
    const [postModel] = models.filter(model => model.modelName === "post");
    assert(postModel.streams.length === 2);
    assert(postModel.streams[0].latest === false);
    assert(postModel.streams[1].latest === true);
  });
});
