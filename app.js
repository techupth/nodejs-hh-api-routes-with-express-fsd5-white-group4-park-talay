// Start coding here
import express from "express";
import { assignments } from "./data/assignments.js";
import { comments } from "./data/comments.js";

let assignmentDatabase = assignments;
let commentDatabase = comments;

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/assignments", (req, res) => {
    const limit = req.query.limit;

    if (limit > 10) {
        return res.status(401).json({
            message: "Invalid request,limit must not exceeds 10 assignments",
        });
    }

    return res.json({
        message: "Complete Fetching assignments",
        data: assignmentDatabase.slice(0, limit),
    });
});

app.get("/assignments/:assignmentsId", (req, res) => {
    const assignmentId = Number(req.params.assignmentsId);
    const assignmentsData = assignmentDatabase.filter((item) => {
        return assignmentId === item.id;
    });

    return res.json({
        message: "Complete Fetching assignments",
        data: assignmentsData[0],
    });
});

app.get("/assignments/:assignmentsId/comments", (req, res) => {
    const assignmentId = Number(req.params.assignmentsId);
    const commentById = commentDatabase.filter((item) => {
        return assignmentId === item.assignmentId;
    });

    return res.json({
        message: "Complete Fetching comments",
        data: commentById,
    });
});

app.post("/assignments", (req, res) => {
    assignmentDatabase.push({
        id: assignmentDatabase[assignmentDatabase.length - 1].id + 1,
        ...req.body,
    });

    return res.json({
        message: "New assignment has been created successfully",
        data: assignmentDatabase[assignmentDatabase.length - 1],
    });
});

app.post("/assignments/:assignmentsId/comments", (req, res) => {
    const assignmentId = Number(req.params.assignmentsId);
    commentDatabase.push({
        id: commentDatabase[commentDatabase.length - 1].id + 1,
        assignmentId,
        ...req.body,
    });

    return res.json({
        message: "New comment has been created successfully",
        data: commentDatabase[commentDatabase.length - 1],
    });
});

app.delete("/assignments/:assignmentsId", (req, res) => {
    const assignmentId = Number(req.params.assignmentsId);
    const newAssignmentsDatabase = assignmentDatabase.filter((item) => {
        return assignmentId !== item.id;
    });

    if (newAssignmentsDatabase.length !== assignmentDatabase.length) {
        assignmentDatabase = newAssignmentsDatabase;
        return res.json({
            message: `Assignment Id : ${assignmentId}  has been deleted successfully`,
        });
    }

    return res.json({
        message: "Cannot delete, No data available!",
    });
});

app.put("/assignments/:assignmentsId", (req, res) => {
    const assignmentId = Number(req.params.assignmentsId);
    const assignmentIndex = assignmentDatabase.findIndex((item) => {
        return assignmentId === item.id;
    });
    if (assignmentIndex !== -1) {
        assignmentDatabase[assignmentIndex] = { id: assignmentId, ...req.body };
        return res.json({
            message: `Assignment Id : ${assignmentId}  has been updated successfully`,
            data: assignmentDatabase[assignmentIndex],
        });
    }

    return res.json({
        message: "Cannot update, No data available!",
    });
});

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});
