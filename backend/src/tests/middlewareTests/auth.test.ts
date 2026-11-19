import { describe, test, expect, vi, beforeEach, afterEach } from "vitest"
import type { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { authenticateToken, isAdmin } from "../../middleware/auth.ts"

describe("Authentication", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.stubEnv("JWT_SECRET", "test-secret")
    })

    afterEach(() => {
        vi.unstubAllEnvs()
    })

    test("MissingToken_With401status", () => {
        const req = {
            headers: {}
        } as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        } as unknown as Response

        const next = vi.fn()

        authenticateToken(req, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({error: "Unauthenticated request: Missing token"})
        expect(next).not.toHaveBeenCalled()
    })

    test("JWTisNotConfigured_With500status", () => {
      vi.stubEnv("JWT_SECRET", undefined)  

      const req = {
            headers: {authorization: "Bearer test-token"} 
        } as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        } as unknown as Response

        const next = vi.fn()

        authenticateToken(req, res, next)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({error: "JWT Secret is not configured"})
        expect(next).not.toHaveBeenCalled()

    })

    test("InvalidToken_With401status", () => {
        const req = {
            headers: {authorization: "Bearer invalid-token"}
        } as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        } as unknown as Response

        const next = vi.fn()

        authenticateToken(req, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({error: "Invalid or expired token"})
        expect(next).not.toHaveBeenCalled()
    }) 

})