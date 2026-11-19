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
        expect(next).not.toHaveBeenCalled()
    })
})