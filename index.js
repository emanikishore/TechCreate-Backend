// Existing backend code
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import { Project } from "./models/projectModel.js";

const app = express();
app.use(express.json());
app.use(cors());

const mongoDBURL = "mongodb+srv://emanikishore:mani1729@cluster0.syvdd39.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Add project (POST)
app.post("/projects", async (request, response) => {
  try {
    if (!request.body.title || !request.body.description || !request.body.imageUrl) {
      return response.status(400).send({
        message: 'Send all required fields: title, description, imageUrl',
      });
    }
    const newProject = {
      title: request.body.title,
      description: request.body.description,
      imageUrl: request.body.imageUrl,
    };

    const project = await Project.create(newProject);
    return response.status(201).json(project);
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ error: error.message });
  }
});

// Get projects (GET)
app.get("/projects", async (request, response) => {
  try {
    const projects = await Project.find({});
    return response.status(200).json(projects);
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({ error: error.message });
  }
});

// Delete project (DELETE)
app.delete("/projects/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const result = await Project.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: 'Project not found' });
    }

    return response.status(200).send({ message: 'Project deleted successfully' });
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

// Update project (PUT)
app.put('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl } = req.body;

    if (!title || !description || !imageUrl) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const updatedProject = await Project.findByIdAndUpdate(id, { title, description, imageUrl }, { new: true });

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.status(200).json(updatedProject);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Database connection
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");
    app.listen(5000, () => {
      console.log("Everything is fine");
    });
  })
  .catch((error) => {
    console.log("Error is :", error.message);
  });
