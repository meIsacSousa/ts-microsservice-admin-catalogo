import Category from "./category";

describe("Category Integration Tests", () => {
    describe("Create Method", () => {
        it("Should get invalid to category when create", () => {
            const asserts = [
                { props: { name: null }, errors: { name: ["name should not be empty", "name must be a string", "name must be shorter than or equal to 255 characters"] } },
                { props: { name: "" }, errors: { name: ["name should not be empty"] } },
                { props: { name: undefined }, errors: { name: ["name should not be empty", "name must be a string", "name must be shorter than or equal to 255 characters"] } },
                { props: { name: true }, errors: { name: ["name must be a string", "name must be shorter than or equal to 255 characters"] } },
                { props: { name: 1 }, errors: { name: ["name must be a string", "name must be shorter than or equal to 255 characters"] } },
                { props: { name: "name", description: true }, errors: { description: ["description must be a string"] } },
                { props: { name: "name", description: 1 }, errors: { description: ["description must be a string"] } },
                { props: { name: "name", description: { a: "object" } }, errors: { description: ["description must be a string"] } },
                { props: { name: "name", is_active: "invalid" }, errors: { is_active: ["is_active must be a boolean value"] } },
                { props: { name: "name", is_active: 1 }, errors: { is_active: ["is_active must be a boolean value"] } },
                { props: { name: null, description: true, is_active: 1 }, errors: { "name": ["name should not be empty", "name must be a string", "name must be shorter than or equal to 255 characters"], "description": ["description must be a string"], "is_active": ["is_active must be a boolean value"] } },
            ]

            asserts.forEach(assert => {
                expect(() => new Category(assert.props as any)).containsErrorMessages(
                    { ...assert.errors }
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
                { props: { name: null }, errors: { "name": ["name should not be empty", "name must be a string", "name must be shorter than or equal to 255 characters"] } },
                { props: { name: "" }, errors: { "name": ["name should not be empty"] } },
                { props: { name: undefined }, errors: { "name": ["name should not be empty", "name must be a string", "name must be shorter than or equal to 255 characters"] } },
                { props: { name: true }, errors: { "name": ["name must be a string", "name must be shorter than or equal to 255 characters"] } },
                { props: { name: 1 }, errors: { "name": ["name must be a string", "name must be shorter than or equal to 255 characters"] } },
                { props: { name: "name", description: true }, errors: { "description": ["description must be a string"] } },
                { props: { name: "name", description: 1 }, errors: { "description": ["description must be a string"] } },
                { props: { name: "name", description: { a: "object" } }, errors: { "description": ["description must be a string"] } },
                { props: { name: null, description: { a: "object" } }, errors: { "name": ["name should not be empty", "name must be a string", "name must be shorter than or equal to 255 characters"], "description": ["description must be a string"] } },
                { props: { name: 1, description: { a: "object" } }, errors: { "name": ["name must be a string", "name must be shorter than or equal to 255 characters"], "description": ["description must be a string"] } },
            ]

            asserts.forEach(assert => {
                expect(() => category
                    .update(assert.props.name as any, assert.props.description as any))
                    .containsErrorMessages(
                        { ...assert.errors }
                    );
            });
        });

        it("Should get valid to category when update", () => {
            const category = new Category({ name: "valid" });

            const asserts = [
                { props: { name: "name" } },
                { props: { name: "name", description: "description" } },
                {
                    props: {
                        name: "name", description: null
                    }
                },
            ]

            asserts.forEach(assert => {
                expect(() => category
                    .update(assert.props.name as any, assert.props.description as any))
                    .not.toThrowError();
            });
        });
    });
});