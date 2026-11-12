import { describe, it, expect, vi, test, beforeEach } from "vitest";
import type { Request, Response } from "express";
import { v7 as uuidv7 } from "uuid";

const mocks = vi.hoisted(() => ({

    findAll: vi.fn(),
    findByPk: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
    destroy: vi.fn()
}))

vi.mock("../db.ts", () => ({
    db: {
        userRecipesCollection: {
            findAll: mocks.findAll,
            findByPk: mocks.findByPk,
            create: mocks.create,
            update: mocks.update,
            destroy: mocks.destroy

        },
        users: {}
    }
}))

import UserRecipesCollectionsController from "../controllers/UserRecipesCollectionsController.js";


// esimene test - kontrollib kas api tagastab kogu retseptikogu HTTP staatuskoodiga "200"

test("Return_AllCollections_With200Status", async () => {
    mocks.findAll.mockResolvedValue([

        { id: "1", CollectionName: "Favorites" }
    ]);

    const req = {} as Request;

    const res = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn().mockReturnThis()

    } as unknown as Response;

    await UserRecipesCollectionsController.getAll(req, res);

    expect(mocks.findAll).toHaveBeenCalledOnce();
    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.send).toHaveBeenCalledWith([{ id: "1", CollectionName: "Favorites" }]);
});

// test number kaks , see test tagastab konkreetse retseptikogu ID alusel HTTP staatuskoodiga "200"

test("Return_OneCollectionById_With200Status", async () => {
    const collection = {
        id: "123",
        CollectionName: "Vegan",
        CollectionDescription: "Plant-based",
        RecipeIds: ["rec-1"]
    };

    mocks.findByPk.mockResolvedValue(collection);

    const req = {
        params: { ID: "123" }
        
    } as unknown as Request;

    const res = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn().mockReturnThis()

    } as unknown as Response;

    await UserRecipesCollectionsController.getById(req, res);

    expect(mocks.findByPk).toHaveBeenCalledWith("123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(collection);
});
