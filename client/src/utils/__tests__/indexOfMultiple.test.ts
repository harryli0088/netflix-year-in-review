import indexOfMultiple from "../indexOfMultiple"

it("returns the index of the first valid search string", () => {
  expect(indexOfMultiple("test", ["test"])).toEqual(0)
  expect(indexOfMultiple("test", ["est"])).toEqual(1)
  expect(indexOfMultiple("test", ["st"])).toEqual(2)
  expect(indexOfMultiple("test", ["t"])).toEqual(0)

  expect(indexOfMultiple("test", ["lalala","test"])).toEqual(0)
  expect(indexOfMultiple("test", ["lalala","est","test"])).toEqual(1)
  expect(indexOfMultiple("test", ["lalala","st","est","test"])).toEqual(2)
  expect(indexOfMultiple("test", ["lalala","t","st","est","test"])).toEqual(0)
})

it("returns -1 if search strings are not in the string", () => {
  expect(indexOfMultiple("test", ["lalala"])).toEqual(-1)
  expect(indexOfMultiple("test", ["lalala","hahaha"])).toEqual(-1)
})
