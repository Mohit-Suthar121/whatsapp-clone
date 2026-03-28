import cron from "node-cron";
import User from "../models/User.js";


export const cleanUpUnverifedUsersJob = async () => {
    cron.schedule("0 * * * *", async () => {
        try {

            console.log("cleaning up users");
            const deletedUsers = await User.deleteMany({
                isVerified: false,
                isRegistrationCompleted: false,
                createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            })

            console.log("unregistered users got deleted successfully! and the users are: ", deletedUsers);
        } catch (error) {
            console.error("Internal server error!", error);
        }


    })

}