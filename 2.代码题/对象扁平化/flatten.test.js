const flatten = require("./flatten");

test("flatten test", () => {
  expect(
    flatten({
      a: {
        b: 1,

        c: 2,

        d: { e: 5 },
      },

      b: [1, 3, { a: 2, b: 3 }],

      c: 3,
    })
  ).toStrictEqual({
      'a.b':1,
      'a.c': 2,
      'a.d.e': 5,
      'b[0]': 1,
      'b[1]': 3,
      'b[2].a': 2,
      'b[2].b': 3,
      'c':3
  });
});
