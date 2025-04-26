import initModels from "../models/init-models.js";
import {sequelize} from "../config/database.js";
let model = initModels(sequelize);
export const syncDeviceData = async (req, res) => {
  try {
    const { name, count, timestamp } = req.body;

    // Check if device exists (same name & timestamp)
    let device = await model.findOne({ where: { name, timestamp } });

    if (device) {
      // Update count
      device.count += count;
      await device.save();
    } else {
      // Create new row
      device = await model.device.create({ name, count, timestamp });
    }

    res.status(200).json({ message: 'Synced', device });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
