import clamp from "../clamp";

describe("clamp", () => {
  it("constrains a number to a min/max range", () => {
    expect(clamp(0, 0, 1)).toEqual(0);
    expect(clamp(5, 0, 10)).toEqual(5);
    expect(clamp(10, 0, 1)).toEqual(1);
    expect(clamp(-1, 0, 1)).toEqual(0);
  });
});
