import mongoose from "mongoose";
import {} from "dotenv/config"

mongoose.connect(process.env.DB_URL!);
const status = {
    PENDING: "PENDING",
    FINISHED: "FINISHED",
    FAILED: "FAILED"
} as const;

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    tasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'tasks'
        }
    ]
})

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    isfinised: { type: String, enum: Object.values(status), default: status.PENDING }
})
const user = mongoose.models.user || mongoose.model('user', userSchema);
const task = mongoose.models.task || mongoose.model('task', taskSchema);

export { user, task, status };