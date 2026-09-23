import Project from '../model/project.model.js';

// Get all projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new project (Admin only)
export const createProject = async (req, res) => {
  try {
    const projectData = { ...req.body };
    
    // Extract uploaded files
    if (req.files) {
      if (req.files['featuredImage']) {
        projectData.featuredImage = req.files['featuredImage'][0].path;
      }
      if (req.files['images']) {
        projectData.images = req.files['images'].map(file => file.path);
      }
    }

    const newProject = new Project(projectData);
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update project (Admin only)
export const updateProject = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Append newly uploaded files, maintaining existing ones handled on frontend
    if (req.files) {
      if (req.files['featuredImage']) {
        updateData.featuredImage = req.files['featuredImage'][0].path;
      }
      if (req.files['images']) {
        // If updating multiple images, the frontend decides whether to append or replace.
        // Assuming replace/append logic is controlled via explicit parameters, here we just attach new ones or overwrite.
        const newImages = req.files['images'].map(file => file.path);
        updateData.images = newImages; 
      }
    }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after', runValidators: true });
    if (!updatedProject) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete project (Admin only)
export const deleteProject = async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
