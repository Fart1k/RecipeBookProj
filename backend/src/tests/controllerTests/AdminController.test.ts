import { describe, expect, vi, test, beforeEach } from "vitest";
import type { Request, Response } from "express";

const mocks = vi.hoisted(() => ({
    findAll: vi.fn(),
    findByPk: vi.fn(),
    findAllUsers: vi.fn(),
    findUserById: vi.fn(),
    destroyComments: vi.fn(),
    transaction: vi.fn()
}))

vi.mock("../../db.ts", () => ({
    db: {
        recipes: {
            findAll: mocks.findAll,
            findByPk: mocks.findByPk
        },
        users: {
            findAll: mocks.findAllUsers,
            findByPk: mocks.findUserById
        },
        comment: {
            destroy: mocks.destroyComments
        },
        sequelize: {
            transaction: mocks.transaction
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

    // See test on korrektne, kui kontroller tagastab 200 statuskoodi, isegi kui ta ei leia ühtegi kasutajat, ta tagastab tühja ARRAY
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

    // See test on korrektne, kui kontoller tagastab 500 statuskoodi, sest juhtus mingi API/andmebaasi viga
    test("getAllUsers_With500status", async () => {
        mocks.findAllUsers.mockRejectedValue(new Error("Internal server error"))

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
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({error: "Internal server error"})
    })

    // See test on korrektne, kui kontroller tagastab 404 statuskoodi, sest ei saa leida kasutajat vastava ID-ga
    test("getById_With404status", async () => {
        const userId = "01a1c462-5d99-771d-99d3-ae6307063wwc"
        mocks.findUserById.mockResolvedValue(null)

        const req = {
            params: {
                ID: userId
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        } as unknown as Response

        await _AdminController.getById(req, res)

        expect(mocks.findUserById).toHaveBeenCalledExactlyOnceWith(userId, {
            attributes: {
                exclude: ["PasswordHash"]
            }
        })
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({error: `User with this ID was not found: ${userId}`})
    })

    // See test on korrektne, kui kontroller tagastab 200 statuskoodi ja kasutajat, mida ta leidis
    test("getById_With200status", async () => {
        const userId = "01a1c462-5d99-771d-99d3-ae6307063wwc"
        const user = {
            id: userId,
            UserName: "TestUser",
            EmailAddress: "test@example.com"
        }
        mocks.findUserById.mockResolvedValue(user)

        const req = {
            params: {
                ID: userId
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        } as unknown as Response

        await _AdminController.getById(req, res)

        expect(mocks.findUserById).toHaveBeenCalledExactlyOnceWith(userId, {
            attributes: {
                exclude: ["PasswordHash"]
            }
        })
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(user)
    })

    // See test on korrektne, kui kontroller tagastab 500 statuskoodi, sest toimus mingi API/andmebaasi viga
    test("getById_With500status", async () => {
        mocks.findUserById.mockRejectedValue(new Error("Internal server error"))
        const userId = "01a1c462-5d99-771d-99d3-ae6307063wwc"
        const req = {
            params: {
                ID: userId
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        } as unknown as Response

        await _AdminController.getById(req, res)
        
        expect(mocks.findUserById).toHaveBeenCalledExactlyOnceWith(userId, {
            attributes: {
                exclude: ["PasswordHash"]
            }
        })
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({error: "Internal server error"})
    })

    // See test on korrektne, kui admin proovib ise enda blokeerida ja kontroller tagastab 400 statuskoodi
    test("banUser_With400status", async () => {
        const userId = "01a1c462-5d99-771d-99d3-ae6307063wwc"

        const req = {
            params: {
                ID: userId
            },
            user: {
                id: userId
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        } as unknown as Response

        await _AdminController.banUser(req, res)

        expect(mocks.findUserById).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({error: "You cannot ban yourself"})
    })

    // See test on korrektne, kui admin sisestas vale kasutajaID ja kontroller tagastas 404 statuskoodi
    test("banUser_With404status", async () => {
        const bannedUserId = "01a1c462-5d99-771d-99d3-ae6307063wwc"
        const adminId = "01a1c462-5d99-771d-99d3-ae6307063awd"

        mocks.findUserById.mockResolvedValue(null)

        const req = { 
            params: {
                ID: bannedUserId
            },
            user: {
                id: adminId
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        } as unknown as Response

        await _AdminController.banUser(req, res)

        expect(mocks.findUserById).toHaveBeenCalledWith(bannedUserId)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({error: `User with this ID was not found: ${bannedUserId}`})
    })

    // See test on korrektne, kui kasutaja on blokeeritud ja tema status on muudetud.
    test("banUser_With200status", async () => {
        const bannedUser = {
            id: "01a1c462-5d99-771d-99d3-ae6307063wwc",
            UserStatus: "verified",
            save: vi.fn().mockResolvedValue(undefined)
        }
        mocks.findUserById.mockResolvedValue(bannedUser)

        const adminId = "01a1c462-5d99-771d-99d3-ae6307063awd"

        const req = {
            params: {
                ID: bannedUser.id
            },
            user: {
                id: adminId
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        } as unknown as Response

        await _AdminController.banUser(req, res)

        expect(mocks.findUserById).toHaveBeenCalledWith(bannedUser.id)
        expect(bannedUser.UserStatus).toBe("banned")
        expect(bannedUser.save).toHaveBeenCalledOnce()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({message: "User banned successfully"})
    })

    // See test on korrektne, kui konroller tagastas 500 statuskoodi, sest juhtus API/andmebaasi viga
    test("banUser_With500status", async () => {
        const userId = "01a1c462-5d99-771d-99d3-ae6307063wwc"
        const adminId = "01a1c462-5d99-771d-99d3-ae6307063awd"

        mocks.findUserById.mockRejectedValue(new Error("Internal server error"))

        const req = {
            params: {
                ID: userId
            },
            user: {
                id: adminId
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        } as unknown as Response

        await _AdminController.banUser(req, res)

        expect(mocks.findUserById).toHaveBeenCalledWith(userId)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({error: "Internal server error"})
    })

    // See test on korrektne, kui kontoller tagastab 200 statuskoodi ja admin saab näha kõiki retsepti
    test("getAllRecipes_With200status", async () => {
        const recipes = [
            {
                id: "01a1c462-5d99-771d-99d3-ae6307063bfc",
                RecipeTitle: "recipe1",
                Status: true
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
            json: vi.fn().mockReturnThis()
        } as unknown as Response 

        await _AdminController.getAllRecipes(req, res)

        expect(mocks.findAll).toHaveBeenCalledOnce()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(recipes)
    })

    // See test on korrektne, kui kontroller tagastab 500 statuskoodi, sest juhtus API/andmebaasi viga
    test("getAllRecipes_With500status", async () => {
        mocks.findAll.mockRejectedValue(new Error("Internal server error"))

        const req = {} as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        } as unknown as Response

        await _AdminController.getAllRecipes(req, res)

        expect(mocks.findAll).toHaveBeenCalledOnce()
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({error: "Internal server error"})
    })

    // See test on korrektne, kui kontroller ei saa leida retsepti ja tagastab 404 statuskoodi
    test("deleteRecipe_With404status", async () => {
        const recipeId = "01a1c462-5d99-771d-99d3-ae6307063bfc"

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

        await _AdminController.deleteRecipe(req, res)

        expect(mocks.findByPk).toHaveBeenCalledWith(recipeId)
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({error: `Recipe with this ID was not found: ${recipeId}`})
    })

    // See test on korrektne, kui retsept ja sellega seotud kommentaarid on kustutatud ja kontroller tagastab 204 statuskoodi
    test("deleteRecipe_With204status", async () => {
        const recipeId = "01a1c462-5d99-771d-99d3-ae6307063bfc"
        const recipe = {
            id: recipeId, 
            destroy: vi.fn().mockResolvedValue(undefined)
        }

        const transaction = {}

        mocks.findByPk.mockResolvedValue(recipe)
        mocks.destroyComments.mockResolvedValue(2)

        mocks.transaction.mockImplementation(async (callback: any) => {
            await callback(transaction)
        })

        const req = {
            params: {
                ID: recipeId
            }
        } as unknown as Request
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis()
        } as unknown as Response

        await _AdminController.deleteRecipe(req, res)

        expect(mocks.findByPk).toHaveBeenCalledWith(recipeId)

        expect(mocks.destroyComments).toHaveBeenCalledWith({
            where: { RecipeId: recipeId },
            transaction
        })

        expect(recipe.destroy).toHaveBeenCalledWith({
            transaction
        })

        expect(mocks.transaction).toHaveBeenCalledOnce()
        expect(res.status).toHaveBeenCalledWith(204)
        expect(res.send).toHaveBeenCalledOnce()
    })

    // See test on korrektne, kui kontroller tagastab 500 statuskoodi, sest juhtus API/andmebaasi viga
    test("deleteRecipe_With500status", async () => {
        mocks.findByPk.mockRejectedValue(new Error("Internal server error"))

        const recipeId = "01a1c462-5d99-771d-99d3-ae6307063bfc"

        const req = {
            params: {
                ID: recipeId
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        } as unknown as Response

        await _AdminController.deleteRecipe(req, res)

        expect(mocks.findByPk).toHaveBeenCalledWith(recipeId)
        expect(mocks.destroyComments).not.toHaveBeenCalled()
        expect(mocks.transaction).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({error: "Internal server error"})
    })
})