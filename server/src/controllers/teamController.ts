import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const getTeams = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const teams = await prisma.team.findMany()

        const teamsWithUsernames = await Promise.all(
            teams.map(async (teams: any) => {
                const productOwner = await prisma.user.findUnique({
                    where: {userId: teams.productOwnerUserId! },
                    select: {username: true},
                })
                const projectManager = await prisma.user.findUnique({
                    where: {userId: teams.projectManagerUserId! },
                    select: {username: true},
                })

                return {
                    ...teams,
                    productOwnerUsername: productOwner?.username,
                    projectManagerUsername: projectManager?.username
                }
            })
        )

        res.json(teamsWithUsernames)
    } catch (error: any) {
        res.status(500).json({ message: `Error retrieving teams: ${error.message} `})
    }
}