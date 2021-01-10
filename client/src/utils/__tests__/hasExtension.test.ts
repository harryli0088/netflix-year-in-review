import hasExtension from "../hasExtension"

it("returns true for good extensions", () => {
  expect(hasExtension("test.jpg",".jpg")).toEqual(true)
  expect(hasExtension("testing123.json",".json")).toEqual(true)
})

it("returns false for bad extensions", () => {
  expect(hasExtension("test.jp",".jpg")).toEqual(false)
  expect(hasExtension("testing123",".json")).toEqual(false)
})
