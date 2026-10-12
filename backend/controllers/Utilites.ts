import {Request} from "express";
//installi bycrpt hiljem siia tuleb hassing ka

export const getBaseURL = {req: Request}: string =>{
    return `${req.protocol}://${req.get}`
}