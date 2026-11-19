import { describe, it, expect, vi, test, beforeEach } from "vitest";
import type { Request, Response } from "express";
import { v7 as uuidv7 } from "uuid"

const mocks = vi.hoisted(() => ({
    create: vi.fn(),
    login: vi.fn()
}))

vi.mock("../../db.ts", () => ({
    db: {
        users: {
            create: mocks.create,
            login: mocks.login
        }
    }
}))

import _UserController from "../../controllers/UserController.ts"

describe("UserController", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    
})