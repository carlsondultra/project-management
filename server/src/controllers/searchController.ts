import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const search = async (
    req: Request,
    res: Response
): Promise<void> => {
    const {query} = req.query
    try {
        const tasks = await prisma.task.findMany({
            where: {
                OR: [
                    { title: { contains: query as string }},
                    { description: { contains: query as string }}
                ],
            },
        })

        const projects = await prisma.project.findMany({
            where: {
                OR: [
                    { name: { contains: query as string }},
                    { description: { contains: query as string }}
                ],
            },
        })

        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { username: { contains: query as string }}
                ],
            },
        })
        res.json({ tasks, projects, users })
    } catch (error: any) {
        res.status(500).json({ message: `Error performing search ${error.message} `})
    }
}



export const createTask = async (
    req: Request,
    res: Response
): Promise<void> => {
    const {
        title,
        description,
        status,
        priority,
        tags,
        startDate,
        dueDate,
        points,
        projectId,
        authorUserId,
        assignedUserId,
    } = req.body
    try {
        const newTask = await prisma.task.create({
            data: {
                title,
                description,
                status,
                priority,
                tags,
                startDate,
                dueDate,
                points,
                projectId,
                authorUserId,
                assignedUserId,
            },
        })
        res.status(201).json(newTask)
    } catch (error: any) {
        res.status(500).json({ message: `Error creating a task: ${error.message} `})
    }
}

export const updateTaskStatus = async (
    req: Request,
    res: Response
): Promise<void> => {
    const {taskId} =  req.params
    const {status} = req.body
    try {
        const updatedTask = await prisma.task.update({
            where: {
                id: Number(taskId),
            },
            data: {
                status: status,
            }
        })
        res.json(updatedTask)
    } catch (error: any) {
        res.status(500).json({ message: `Error updating task: ${error.message} `})
    }
}