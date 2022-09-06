import Category from "./category";

describe("Category Integration Tests", () => {
    describe("Create Method", () => {
        it("Should get invalid to category when create", () => {
            const asserts = [
                { props: { name: null }, errors: ["The property name is required."] },
                { props: { name: "" }, errors: ["The property name is required."] },
                { props: { name: undefined }, errors: ["The property name is required."] },
                { props: { name: true }, errors: ["The property name must be a string."] },
                { props: { name: 1 }, errors: ["The property name must be a string."] },
                { props: { name: "name", description: true }, errors: ["The property description must be a string."] },
                { props: { name: "name", description: 1 }, errors: ["The property description must be a string."] },
                { props: { name: "name", description: { a: "object" } }, errors: ["The property description must be a string."] },
                { props: { name: "name", is_active: "invalid" }, errors: ["The property is_active must be a boolean."] },
                { props: { name: "name", is_active: 1 }, errors: ["The property is_active must be a boolean."] },
                { props: { name: null, description: true, is_active: 1 }, errors: ["The property name is required."] },
            ]

            asserts.forEach(assert => {
                expect(() => new Category(assert.props as any)).toThrowError(
                    ...assert.errors
                );
            });
        });

        it("Should get valid to category when create", () => {
            const asserts = [
                { props: { name: "name" } },
                { props: { name: "name", description: "description" } },
                { props: { name: "name", description: "description", is_active: true } },
                { props: { name: "name", description: "description", is_active: false } },
            ]

            asserts.forEach(assert => {
                expect(() => new Category(assert.props as any)).not.toThrowError();
            });
        });
    });


    describe("Update Method", () => {
        it("Should get invalid to category when update", () => {
            const category = new Category({ name: "valid" });

            const asserts = [
                { props: { name: null }, errors: ["The property name is required."] },
                { props: { name: "" }, errors: ["The property name is required."] },
                { props: { name: undefined }, errors: ["The property name is required."] },
                { props: { name: true }, errors: ["The property name must be a string."] },
                { props: { name: 1 }, errors: ["The property name must be a string."] },
                { props: { name: "name", description: true }, errors: ["The property description must be a string."] },
                { props: { name: "name", description: 1 }, errors: ["The property description must be a string."] },
                { props: { name: "name", description: { a: "object" } }, errors: ["The property description must be a string."] },
                { props: { name: null, description: { a: "object" } }, errors: ["The property name is required."] },
                { props: { name: 1, description: { a: "object" } }, errors: ["The property name must be a string."] },
            ]

            asserts.forEach(assert => {
                expect(() => category
                    .update(assert.props.name as any, assert.props.description as any))
                    .toThrowError(
                        ...assert.errors
                    );
            });
        });

        it("Should get valid to category when update", () => {
            const category = new Category({ name: "valid" });

            const asserts = [
                { props: { name: "name" } },
                { props: { name: "name", description: "description" } },
                { props: { name: "name", description: null } },
            ]

            asserts.forEach(assert => {
                expect(() => category
                    .update(assert.props.name as any, assert.props.description as any))
                    .not.toThrowError();
            });
        });
    });
});