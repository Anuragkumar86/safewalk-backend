import prisma from "../lib/prismaDb.js";
export const addContact = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email, phoneNumber } = req.body;
        console.log("USERID: ", userId);
        const newContact = await prisma.emergencyContact.create({
            data: {
                userId: userId,
                name,
                email,
                phoneNumber
            }
        });
        res.status(201).json({
            message: "Successfully added contact with name: ", name,
            newContact: newContact
        });
    }
    catch (err) {
        res.status(201).json({
            message: "Filed to add contact with err: ", err
        });
    }
};
export const updateContact = async (req, res) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;
        const { name, email, phoneNumber } = req.body;
        const updatedContact = await prisma.emergencyContact.update({
            where: { userId, id },
            data: {
                name,
                email,
                phoneNumber
            }
        });
        res.status(201).json({
            message: "Successfully updated contact with name: ", name,
            updatedContact: updatedContact
        });
    }
    catch (err) {
        res.status(201).json({
            message: "Filed to update contact with err: ", err
        });
    }
};
export const getAllContact = async (req, res) => {
    const userId = req.user.id;
    try {
        const allContacts = await prisma.emergencyContact.findMany({ where: { userId: userId } });
        res.status(200).json({
            message: "Successfully fetched all users",
            allContacts: allContacts
        });
    }
    catch (err) {
        res.status(200).json({
            message: "Error in fetching all users", err,
        });
    }
};
export const deleteContact = async (req, res) => {
    const userId = req.user.id;
    const id = req.params.id;
    try {
        await prisma.emergencyContact.delete({
            where: { id, userId }
        });
        res.status(200).json({
            message: "Successfully Deleted Contact",
        });
    }
    catch (err) {
        res.status(200).json({
            message: "Error in deleting Contact", err,
        });
    }
};
//# sourceMappingURL=EmergencyContactController.js.map