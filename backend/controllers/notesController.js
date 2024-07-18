import { Note } from "../models/Note.js";
import { Label } from "../models/Label.js";


export const createNote = async (req, res) => {
    const { title, content, tags, backgroundColor, reminder } = req.body;

    try {
        const labelNames = [];

        for (let tag of tags) {
            let label = await Label.findOne({ name: tag.trim(), user: req.userId });

            if (!label) {
                label = new Label({ name: tag.trim(), user: req.userId });
                await label.save();
            }

            labelNames.push(label.name);
        }

        const note = new Note({
            title,
            content,
            tags: labelNames, 
            backgroundColor,
            reminder,
            user: req.userId,
        });

        await note.save();
        return res.status(201).json(note);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}



export const updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content, tags, backgroundColor, reminder, archived, trashed } = req.body;

  try {
    const note = await Note.findOne({ _id: id, user: req.userId });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (tags !== undefined) note.tags = tags;
    if (backgroundColor !== undefined) note.backgroundColor = backgroundColor;
    if (reminder !== undefined) note.reminder = reminder;
    if (archived !== undefined) note.archived = archived;
    if (trashed !== undefined) note.trashed = trashed;

    await note.save();
    res.status(200).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.userId });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};
