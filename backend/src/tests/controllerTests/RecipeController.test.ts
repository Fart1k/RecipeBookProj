import { describe, it, expect, vi, test, beforeEach } from "vitest";

//describe, organiseerib teste
//it - on pks test case, on sama nagu test()
//expect - on assert, "expect(10).toBe(5)", expected ja actuali analoog
//vi - virtualiseerija millega tehakse mockobjekte, meetodeid andmebaase jne - on kui "virtual"
//beforeEach käivitan setupi enne igat testi

import type { Request, Response } from "express";
import { v7 as uuidv7 } from "uuid";

const mocks = vi.hoisted(() => ({
    findAll: vi.fn(),
    findByPk: vi.fn()
}))

vi.mock("../../db.ts", () => ({
    db: {
        recipes: {
            findAll: mocks.findAll,
            findByPk: mocks.findByPk
        }
    }
}))

import _RecipeController from "../../controllers/RecipeController.ts"

// Describe the test set for RecipeController
describe("RecipeController", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    test("Return_AllRecipes_With200Status", async () => {
        // Ülesseade
        mocks.findAll.mockResolvedValue(
            [
                // Andmed ei pea olema pärised.
                // Atributid peavad olema õigesti kirjutatud
                {id: "01a1c462-5d99-771d-99d3-ae6307063bfc", RecipeTitle: "recipe1"},
                {id: "01a1c463-53d3-714f-8ad5-83119e0cd2ce", RecipeTitle: "recipe2"},
                {id: "58fe1398-dcd8-11f1-8dc2-901b0eec5991", RecipeTitle: "recipe3"}
            ]
        )

        const req = {} as Request
        const res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis()
        } as unknown as Response

        // Tegevus
        await _RecipeController.getAll(req, res)

        // Kontroll
        expect(mocks.findAll).toHaveBeenCalledOnce()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith([
            {id: "01a1c462-5d99-771d-99d3-ae6307063bfc", RecipeTitle: "recipe1"},
            {id: "01a1c463-53d3-714f-8ad5-83119e0cd2ce", RecipeTitle: "recipe2"},
            {id: "58fe1398-dcd8-11f1-8dc2-901b0eec5991", RecipeTitle: "recipe3"}
        ])
    })

    test("Return_OneRecipeById_With200Status", async () => {
        const recipe = {
            id: "58fe1398-dcd8-11f1-8dc2-901b0eec5991",
            RecipeTitle: "recipe1",
            Instructions: "1. blabla",
            Ingredients: "yoyoyo",
            ImageUrl: null,
            Status: true,
            RatingOverall: 2,
            IsVisibleToOther: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        
        const req = {
            params: {
                ID: recipe.id
            }
        } as unknown as Request
        
        const res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis()
        } as unknown as Response

        mocks.findByPk.mockResolvedValue(recipe)

        await _RecipeController.getByID(req, res)

        expect(mocks.findByPk).toHaveBeenCalledExactlyOnceWith(recipe.id)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(recipe)
    })
})