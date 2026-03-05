const formatCreatedAt = require("../utils/timeConverter");

describe("timeConverter utility", () => {
  test("should format date correctly with 'st' suffix", () => {
    const date = "2026-04-01T13:22:43.115+00:00";
    const formatted = formatCreatedAt(date);
    expect(formatted).toMatch(/April 1st, 2026/);
  });

  test("should format date correctly with 'nd' suffix", () => {
    const date = "2026-04-02T13:22:43.115+00:00";
    const formatted = formatCreatedAt(date);
    expect(formatted).toMatch(/April 2nd, 2026/);
  });

  test("should format date correctly with 'rd' suffix", () => {
    const date = "2026-04-03T13:22:43.115+00:00";
    const formatted = formatCreatedAt(date);
    expect(formatted).toMatch(/April 3rd, 2026/);
  });

  test("should format date correctly with 'th' suffix", () => {
    const date = "2026-04-18T13:22:43.115+00:00";
    const formatted = formatCreatedAt(date);
    expect(formatted).toMatch(/April 18th, 2026/);
  });
});
