import { Label } from "../models/Label.js";


export const createLabel = async (req, res) => {
    const { name } = req.body;
  
    try {
      const existingLabel = await Label.findOne({ name, user: req.userId });
      if (existingLabel) {
        return res.status(400).json({ error: 'Label already exists' });
      }
  
      const label = new Label({ name, user: req.userId });
      await label.save();
      res.status(201).json(label);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  export const updateLabel = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
  
    try {
      const label = await Label.findOne({ _id: id, user: req.userId });
      if (!label) {
        return res.status(404).json({ error: 'Label not found' });
      }
  
      label.name = name;
      await label.save();
      res.status(200).json(label);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  


  export const getLabels = async (req, res) => {
    try {
      const labels = await Label.find({ user: req.userId });
      res.status(200).json(labels);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch labels' });
    }
  };
  