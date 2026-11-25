import { describe, expect, vi, test, beforeEach } from "vitest";
import type { Request, Response } from "express";

const mocks = vi.hoisted(() => ({
    findAll: vi.fn()
}))

vi.mock("../../db.ts", () => ({
    db: {
        recipes: {
            findAll: mocks.findAll
        }
    }
}))

import _AdminController from "../../controllers/AdminController.ts"

describe("AdminController", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // See test on korrektne, kui kontroller tagastab 200 statuskoodi ja admin saab näha ainult need retsiptid, mis ei ole veel kinnitud.
    test("GetAllUnapprovedRecipes_With200status", async () => {
        const recipes = [
            {
                id: "01a1c462-5d99-771d-99d3-ae6307063bfc",
                RecipeTitle: "recipe1",
                Status: false
            },
            {
                id: "01a1c463-53d3-714f-8ad5-83119e0cd2ce",
                RecipeTitle: "recipe2",
                Status: false
            }   
        ]

        mocks.findAll.mockResolvedValue(recipes)

        const req = {
            query: {}
        } as Request
        
        const res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis()
        } as unknown as Response

        await _AdminController.getAllRecipesToApprove(req, res)

        expect(mocks.findAll).toHaveBeenCalledExactlyOnceWith({where: {
            Status: false
        }})
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith([
            {
                id: recipes[0]?.id,
                title: recipes[0]?.RecipeTitle,
                status: recipes[0]?.Status
            },
            {
                id: recipes[1]?.id,
                title: recipes[1]?.RecipeTitle,
                status: recipes[1]?.Status
            }
        ])
    })

    // See test on korrektne, kui kontroller tagastab 500 statuskoodi, sest ei saanud leida ühtegi retsepti serveri probleemi seosega
    test("GetAllUnapprovedRecipes_With500status", async () => {
        mocks.findAll.mockRejectedValue(new Error("Failed to get recipes"))

        const req = {} as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis()
        } as unknown as Response

        await _AdminController.getAllRecipesToApprove(req, res)

        expect(mocks.findAll).toHaveBeenCalledExactlyOnceWith({where: {
            Status: false
        }})
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith({
            error: "Failed to get recipes"
        })
    })
})