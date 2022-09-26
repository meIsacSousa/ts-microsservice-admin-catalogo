import { SearchParams, SearchResult } from "../repository-contracts";

describe("Search Unit Tests", () => {
  describe("SearchParams Unit Tests", () => {
    test("Page Prop", () => {
      const assert = [
        { page: null, expected: 1 },
        { page: undefined, expected: 1 },
        { page: "", expected: 1 },
        { page: 1, expected: 1 },
        { page: 0, expected: 1 },
        { page: -1, expected: 1 },
        { page: 5.1, expected: 1 },
        { page: "fake", expected: 1 },
        { page: true, expected: 1 },
        { page: false, expected: 1 },
        { page: 32, expected: 32 },
      ];
      assert.forEach((assert) => {
        const searchParams = new SearchParams({ page: assert.page as any });
        expect(searchParams.page).toBe(assert.expected);
      });
    });

    test("Per_page Prop", () => {
      const assert = [
        { per_page: null, expected: 15 },
        { per_page: undefined, expected: 15 },
        { per_page: "", expected: 15 },
        { per_page: 0, expected: 15 },
        { per_page: -1, expected: 15 },
        { per_page: 5.1, expected: 15 },
        { per_page: "fake", expected: 15 },
        { per_page: true, expected: 15 },
        { per_page: false, expected: 15 },
        { per_page: 1, expected: 1 },
        { per_page: 32, expected: 32 },
      ];
      assert.forEach((assert) => {
        const searchParams = new SearchParams({
          per_page: assert.per_page as any,
        });
        expect(searchParams.per_page).toBe(assert.expected);
      });
    });

    test("Sort Prop", () => {
      const assert = [
        { sort: null, expected: null },
        { sort: undefined, expected: null },
        { sort: "", expected: null },
        { sort: true, expected: "true" },
        { sort: false, expected: "false" },
        { sort: 1, expected: "1" },
        { sort: -1, expected: "-1" },
        { sort: 32, expected: "32" },
        { sort: 5.1, expected: "5.1" },
        { sort: {}, expected: "[object Object]" },
        { sort: "field", expected: "field" },
      ];
      assert.forEach((assert) => {
        const searchParams = new SearchParams({ sort: assert.sort as any });
        expect(searchParams.sort).toBe(assert.expected);
      });
    });

    test("Sort_dir Prop", () => {
      const assert = [
        { sort_dir: null, expected: "ASC" },
        { sort_dir: undefined, expected: "ASC" },
        { sort_dir: "", expected: "ASC" },
        { sort_dir: 0, expected: "ASC" },
        { sort_dir: true, expected: "ASC" },
        { sort_dir: false, expected: "ASC" },
        { sort_dir: 1, expected: "ASC" },
        { sort_dir: -1, expected: "ASC" },
        { sort_dir: 32, expected: "ASC" },
        { sort_dir: 5.1, expected: "ASC" },
        { sort_dir: "field", expected: "ASC" },
        { sort_dir: "ASC", expected: "ASC" },
        { sort_dir: "asc", expected: "ASC" },
        { sort_dir: "DESC", expected: "DESC" },
        { sort_dir: "desc", expected: "DESC" },
      ];
      assert.forEach((assert) => {
        const searchParams = new SearchParams({
          sort_dir: assert.sort_dir as any,
          sort: "field",
        });
        expect(searchParams.sort_dir).toBe(assert.expected);
      });
    });

    test("Filter Prop", () => {
      const assert = [
        { filter: null, expected: null },
        // { filter: undefined, expected: null },
        { filter: "", expected: null },
        { filter: true, expected: "true" },
        { filter: false, expected: "false" },
        { filter: 1, expected: "1" },
        { filter: -1, expected: "-1" },
        { filter: 32, expected: "32" },
        { filter: 5.1, expected: "5.1" },
        { filter: {}, expected: "[object Object]" },
        { filter: "field", expected: "field" },
      ];
      assert.forEach((assert) => {
        const searchParams = new SearchParams({ filter: assert.filter as any });
        expect(searchParams.filter).toBe(assert.expected);
      });
    });
  });

  describe("SearchResult Unit Tests", () => {
    test("Constructor props", () => {
      const asserts = [
        {
          props: {
            items: ["item1", "item2"],
            total: 4,
            current_page: 1,
            per_page: 2,
            sort: null,
            sort_dir: null,
            filter: null,
          },
          last_page: 2,
        },
        {
          props: {
            items: ["item1", "item2"],
            total: 4,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "test",
          },
          last_page: 2,
        },
        {
          props: {
            items: ["item1", "item2"],
            total: 27,
            current_page: 1,
            per_page: 5,
            sort: "name",
            sort_dir: "asc",
            filter: "test",
          },
          last_page: 6,
        },
      ];

      asserts.forEach((assert) => {
        const searchResult = new SearchResult(assert.props as any);
        expect(searchResult.toJSON()).toStrictEqual({
          ...assert.props,
          last_page: assert.last_page,
        });
      });
    });

    it("Should set last_page 1 when per_page field is greater than total field", () => {
      const searchResult = new SearchResult({
        items: [],
        total: 2,
        current_page: 1,
        per_page: 5,
        sort: null,
        sort_dir: null,
        filter: null,
      });
      expect(searchResult.last_page).toBe(1);
    });
  });
});
