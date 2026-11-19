import { describe, it, expect, vi, test, beforeEach } from "vitest";
import type { Request, Response } from "express";
import { v7 as uuidv7 } from "uuid"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const mocks = vi.hoisted(() => ({
    create: vi.fn(),
    login: vi.fn(),
    findOne: vi.fn(),
    findCredential: vi.fn(),
    findCredentialByPk: vi.fn()
}))

vi.mock("../../db.ts", () => ({
    db: {
        users: {
            create: mocks.create,
            login: mocks.login,
            findOne: mocks.findOne
        },
        credential: {
            findOne: mocks.findCredential,
            findByPk: mocks.findCredentialByPk
        }
    }
}))

import _UserController from "../../controllers/UserController.ts"

describe("UserController", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    test("Register_With201status", async () => {
        const userData = {
            UserName: "TestUser",
            EmailAddress: "test@example.com",
            Password: "TestPassword123"
        }
        
        const createdUser = {
            id: "01a1c462-5d99-771d-99d3-ae6307063bfc",
            UserName: userData.UserName,
            EmailAddress: userData.EmailAddress,
            PasswordHash: "hashedPassword",
            UserStatus: "verified",
            CredentialId: "01a1c462-5d99-771d-99d3-ae6307063bfc"
        }

        const resMessage = {
            message: "User registered successfully",
            userId: expect.any(String),
            username: createdUser.UserName
        }

        mocks.findOne.mockResolvedValue(null)

        mocks.findCredential.mockResolvedValue({
            id: createdUser.CredentialId,
            UserType: "user"
        })

        mocks.create.mockResolvedValue(createdUser)

        const req = {
            body: userData
        } as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis()
        } as unknown as Response

        await _UserController.create(req, res)

        expect(mocks.create).toHaveBeenCalledExactlyOnceWith({
            id: expect.any(String),
            UserName: createdUser.UserName,
            EmailAddress: createdUser.EmailAddress,
            PasswordHash: expect.any(String),
            UserStatus: createdUser.UserStatus,
            CredentialId: createdUser.CredentialId
        })

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith(resMessage)
    })

    test("Register_MissingParameters_With400status", async () => {
        const req = {
            body: {
                EmailAddress: "test@exampl.com",
                Password: "TestPassword123"
            }
        } as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis()
        } as unknown as Response

        await _UserController.create(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({
            error: "Missing parameters, please review data"
        })
        expect(mocks.create).not.toHaveBeenCalled()
    })

    test("Register_ExistingEmail_With400status", async () => {
        const userData = {
            UserName: "TestUser",
            EmailAddress: "test@example.com",
            Password: "TestPassword123"
        }

        const existingUser = {
            id: "01a1c462-5d99-771d-99d3-ae6307063bfc",
            EmailAddress: userData.EmailAddress
        }

        mocks.findOne.mockResolvedValue(existingUser)

        const req = {
            body: userData
        } as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis()
        } as unknown as Response

        await _UserController.create(req, res)

        expect(mocks.findOne).toHaveBeenCalledWith({where: { EmailAddress: userData.EmailAddress }})
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({error: "Email is already in use"})

        expect(mocks.create).not.toHaveBeenCalled()
    })

    test("Login_MissingParametes_With400tatus", async () => {
        const req = {
            body: {
                EmailAddress: "test@example.com"
            } 
        } as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis()
        } as unknown as Response

        await _UserController.login(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({
            error: "Email and password are required"
        })
        expect(mocks.login).not.toHaveBeenCalled()
    })

    test("Login_UserNotFound_With401status", async () => {
        const userData = {
            EmailAddress: "test@example.com",
            Password: "TestPassword123"
        }

        mocks.findOne.mockResolvedValue(null)

        const req = {
            body: userData
        } as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis()
        } as unknown as Response

        await _UserController.login(req, res)

        expect(mocks.findOne).toHaveBeenCalledExactlyOnceWith({where: {EmailAddress: userData.EmailAddress}})
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.send).toHaveBeenCalledWith({error: "User not found"})
    })

    test("Login_InvalidPassword_With401status", async () => {
        const userData = {
            EmailAddress: "test@example.com",
            Password: "WrongPassword123"
        }

        const existingUser = {
            id: "01a1c462-5d99-771d-99d3-ae6307063bfc",
            UserName: "TestUser",
            EmailAddress: userData.EmailAddress,
            PasswordHash: await bcrypt.hash("TestPassword123", 10),
            UserStatus: "verified"
        }

        mocks.findOne.mockResolvedValue(existingUser)

        const req = {
            body: userData
        } as Request
        
        const res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis()
        } as unknown as Response

        await _UserController.login(req, res)

        expect(mocks.findOne).toHaveBeenCalledExactlyOnceWith({where: {EmailAddress: userData.EmailAddress}})
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.send).toHaveBeenCalledWith({error: "Invalid password"})
    })

    test("Login_UnverifiedAccount_With403status", async () => {
        const userData = {
            EmailAddress: "test@example.com",
            Password: "TestPassword123"
        }

        const existingUser = {
            id: "01a1c462-5d99-771d-99d3-ae6307063bfc",
            UserName: "TestUser",
            EmailAddress: userData.EmailAddress,
            PasswordHash: await bcrypt.hash("TestPassword123", 10),
            UserStatus: "unverified"
        }

        mocks.findOne.mockResolvedValue(existingUser)

        const req = {
            body: userData
        } as Request
        
        const res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis()
        } as unknown as Response

        await _UserController.login(req, res)

        expect(mocks.findOne).toHaveBeenCalledExactlyOnceWith({where: {EmailAddress: userData.EmailAddress}})
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.send).toHaveBeenCalledWith({error: "Account is not active"})
    })

    test("Login_RoleNotFound_With500status", async () => {
        const userData = {
            EmailAddress: "test@example.com",
            Password: "TestPassword123"
        }

        const existingUser = {
            id: "01a1c462-5d99-771d-99d3-ae6307063bfc",
            UserName: "TestUser",
            EmailAddress: userData.EmailAddress,
            PasswordHash: await bcrypt.hash("TestPassword123", 10),
            UserStatus: "verified",
            CredentialId: "01a1c462-5d99-771d-99d3-ae6307063def"
        }

        mocks.findOne.mockResolvedValue(existingUser)
        mocks.findCredentialByPk.mockResolvedValue(null)

        const req = {
            body: userData
        } as Request
        
        const res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis()
        } as unknown as Response

        await _UserController.login(req, res)

        expect(mocks.findCredentialByPk).toHaveBeenCalledExactlyOnceWith(existingUser.CredentialId)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith({error: "User role was not found"})
    })

    test("Login_JWTsecretNotConfigured_With500status", async () => {
        const userData = {
            EmailAddress: "test@example.com",
            Password: "TestPassword123"
        }

        const existingUser = {
            id: "01a1c462-5d99-771d-99d3-ae6307063bfc",
            UserName: "TestUser",
            EmailAddress: userData.EmailAddress,
            PasswordHash: await bcrypt.hash("TestPassword123", 10),
            UserStatus: "verified",
            CredentialId: "01a1c462-5d99-771d-99d3-ae6307063def"
        }

        const credential = {
            id: existingUser.CredentialId,
            UserType: "user"
        }

        mocks.findOne.mockResolvedValue(existingUser)
        mocks.findCredentialByPk.mockResolvedValue(credential)

        vi.stubEnv("JWT_SECRET", undefined)

        const req = {
            body: userData
        } as Request
        
        const res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis()
        } as unknown as Response

        await _UserController.login(req, res)

        expect(mocks.findCredentialByPk).toHaveBeenCalledExactlyOnceWith(existingUser.CredentialId)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith({error: "JWT secret is not configured"})
    })

    test("Login_With200status", async () => {
        const userData = {
            EmailAddress: "test@example.com",
            Password: "TestPassword123"
        }

        const existingUser = {
            id: "01a1c462-5d99-771d-99d3-ae6307063bfc",
            UserName: "TestUser",
            EmailAddress: userData.EmailAddress,
            PasswordHash: await bcrypt.hash("TestPassword123", 10),
            UserStatus: "verified",
            CredentialId: "01a1c462-5d99-771d-99d3-ae6307063def"
        }

        const credential = {
            id: existingUser.CredentialId,
            UserType: "user"
        }

        mocks.findOne.mockResolvedValue(existingUser)
        mocks.findCredentialByPk.mockResolvedValue(credential)

        vi.stubEnv("JWT_SECRET", "test-secretjwt")

        const req = {
            body: userData
        } as Request
        
        const res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis()
        } as unknown as Response

        await _UserController.login(req, res)

        expect(mocks.findOne).toHaveBeenCalledExactlyOnceWith({where: {EmailAddress: userData.EmailAddress}})
        expect(mocks.findCredentialByPk).toHaveBeenCalledExactlyOnceWith(existingUser.CredentialId)
        expect(res.status).toHaveBeenCalledWith(200)

        expect(res.send).toHaveBeenCalledWith({
            message: "Login successful",
            token: expect.any(String),
            user: {
                id: existingUser.id,
                username: existingUser.UserName,
                email: existingUser.EmailAddress,
                role: credential.UserType
            }
        })

        const token = vi.mocked(res.send).mock.calls[0]![0].token

        expect(jwt.verify(token, "test-secretjwt")).toMatchObject({
            id: existingUser.id,
            email: existingUser.EmailAddress,
            role: credential.UserType
        })
    })
})