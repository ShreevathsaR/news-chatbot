import prisma from "../db/prisma.js";

export const createQuery = async (req, res) => {
    const { query } = req.body;
    const { id } = req.user

    if (!id || !query) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        //Check for duplicates??
        const response = await prisma.query.create({
            data: {
                query,
                userId: id
            }
        });
        return res.status(201).json({ success: true, data: response, message: "Query created sucessfully" });
    } catch (error) {
        console.error("Error creating query:", error);
        return res.status(500).json({ success: false, message: "Failed to create query" });
    }
};

export const getQueries = async (req, res) => {
    const {id} = req.user

    try {
        const queries = await prisma.query.findMany({
            where:{
                userId: id
            }
        })
        res.status(200).json({success: true, message:"Queries retrieved", data: queries})

    } catch (error) {
        res.status(500).json({success: false, message:"Internal server error"})
    }
}

export const deleteQuery = async (req, res) => {
    const { id } = req.params

    try {
        await prisma.query.delete({
            where: { id: Number(id) }
        })
        res.status(200).json({success: true, message: "Query deleted successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: "Internal server error", error: error})
    }
}