import { describe, expect, vi, test, beforeEach } from "vitest";
import type { Request, Response } from "express";

const mocks = vi.hoisted(() => ({
    findAll: vi.fn(),
    findByPk: vi.fn(),
    findAllUsers: vi.fn()
}))

vi.mock("../../db.ts", () => ({
    db: {
        recipes: {
            findAll: mocks.findAll,
            findByPk: mocks.findByPk
        },
        users: {
            findAll: mocks.findAllUsers
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

    // See test on korrektne, kui kontroller ei leia retsept ja tagastab 404 statuskoodi
    test("ApproveRecipe_With404status", async () => {
        const recipeId = "01a1c462-5d99-771d-99d3-ae6307063bfc"
        mocks.findByPk.mockResolvedValue(null)

        const req = {
            params: {
                ID: recipeId
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis()
        } as unknown as Response

        await _AdminController.approveRecipe(req, res)

        expect(mocks.findByPk).toHaveBeenCalledWith(recipeId)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.send).toHaveBeenCalledWith({error: `Recipe with this ID was not found: ${recipeId}`})
    })

    // See test on korrektne, kui retsepti staatus on muudetud ja kontroller tagastab 200 statuskoodi
    test("ApproveRecipe_With200status", async () => {
        const recipeId = "01a1c462-5d99-771d-99d3-ae6307063bfc"

        const recipe = {
            id: "01a1c462-5d99-771d-99d3-ae6307063bfc",
            Status: false,
            save: vi.fn().mockResolvedValue(undefined)
        }
        mocks.findByPk.mockResolvedValue(recipe)

        const req = {
            params: {
                ID: recipeId
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis()
        } as unknown as Response

        await _AdminController.approveRecipe(req, res)

        expect(mocks.findByPk).toHaveBeenCalledWith(recipeId)
        expect(recipe.Status).toBe(true)
        expect(recipe.save).toHaveBeenCalledOnce()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith({message: `Recipe with ID: ${recipeId} status has changed to TRUE`})
    })

    // See test on korrektne, kui kontroller tagastab 500 statuskoodi, sest juhtus mingi API/andmebaasi viga
    test("ApproveRecipe_With500status", async () => {
        const recipeId = "01a1c462-5d99-771d-99d3-ae6307063bfc"

        mocks.findByPk.mockRejectedValue(new Error("Failed to update recipe status"))

        const req = {
            params: {
                ID: recipeId
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis()
        } as unknown as Response

        await _AdminController.approveRecipe(req, res)

        expect(mocks.findByPk).toHaveBeenCalledWith(recipeId)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith({error: "Failed to update recipe status"})
    })

    // See test on korrektne, kui kontroller ei leia retsept ja tagastab 404 statuskoodi
    test("RejectRecipe_With404status", async () => {
        const recipeId = "01a1c462-5d99-771d-99d3-ae6307063wwc"
        mocks.findByPk.mockResolvedValue(null)

        const req = {
            params: {
                ID: recipeId
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        } as unknown as Response

        await _AdminController.rejectRecipe(req, res)

        expect(mocks.findByPk).toHaveBeenCalledWith(recipeId)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({error: `Recipe with this id was not found: ${recipeId}`})
    })

    // See test on korrektne, kui retsepti staatus on muudetud ja kontroller tagastab 200 statuskoodi
    test("RejectRecipe_With200status", async () => {
        const recipeId = "01a1c462-5d99-771d-99d3-ae6307063bfc"
        
        const recipe = {
            id: recipeId,
            Status: false,
            save: vi.fn().mockResolvedValue(undefined)
        }
        mocks.findByPk.mockResolvedValue(recipe)

        const req = {
            params: {
                ID: recipeId
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        } as unknown as Response

        await _AdminController.rejectRecipe(req, res)

        expect(mocks.findByPk).toHaveBeenCalledWith(recipeId)
        expect(recipe.Status).toBe(false)
        expect(recipe.save).toHaveBeenCalledOnce()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({message: "Recipe rejected successfully"})
    })
    
    // See test on korrektne, kui kontroller tagastab 500 statuskoodi, sest juhtus mingi API/andmebaasi viga
    test("RejectRecipe_With500status", async () => {
        const recipeId = "01a1c462-5d99-771d-99d3-ae6307063bfc"

        mocks.findByPk.mockRejectedValue(new Error("Internal server error"))

        const req = {
            params: {
                ID: recipeId
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        } as unknown as Response

        await _AdminController.rejectRecipe(req, res)

        expect(mocks.findByPk).toHaveBeenCalledWith(recipeId)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({error: "Internal server error"})
    })

    test("getAllUsers_With200status", async () => {
        const users = [
            {
                id: "01a1c462-5d99-771d-99d3-ae6307063bfc",
                UserName: "username",
                EmailAddress: "test@example.com"
            },
            {
                id: "01a1c462-5d99-771d-99d3-ae6307063awd",
                UserName: "username1",
                EmailAddress: "test2@example.com"
            }
        ]

        mocks.findAllUsers.mockResolvedValue(users)

        const req = {} as Request
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        } as unknown as Response

        await _AdminController.getAllUsers(req, res)

        expect(mocks.findAllUsers).toHaveBeenCalledExactlyOnceWith({
            attributes: {
                exclude: ["PasswordHash"]
            }
        })
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(users)
    })

    test("getAllUsers_With500status", async () => {
        mocks.findAllUsers.mockRejectedValue(new Error("Internal server error"))

        
    })
})