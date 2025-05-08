import initModels from "../models/init-models.js";
import { sequelize } from "../config/database.js";
import User from "../models/User.js";
import Scan from "../models/Scan.js";
import Count from "../models/Count.js";
let model = initModels(sequelize);


export const syncDeviceData = async (req, res) => {
  const t = await sequelize.transaction(); // Initialize the transaction (t)
  try {
    const { timestamp, location, userID, devices } = req.body;

    if (!timestamp || !location || !userID || !devices) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const incomingDate = new Date(timestamp);

    // 1. Check if a scan already exists for the user and location
    const latestScan = await Scan.findOne({
      where: {
        userID,
        location,
      },
      order: [["timestamp", "DESC"]],
      transaction: t
    });
    let scan;
    if (!latestScan) {
      // 2. If no scan exists, create a new scan
      scan = await Scan.create({ userID, timestamp, location }, { transaction: t });

    } else {
      // 3. If a scan exists, check the date
      const latestDate = new Date(latestScan.timestamp);

      const isSameDay = (
        latestDate.getFullYear() === incomingDate.getFullYear() &&
        latestDate.getMonth() === incomingDate.getMonth() &&
        latestDate.getDate() === incomingDate.getDate()
      );

      if (isSameDay) {
        // 3.1. If it's the same day, delete the old counts and insert the new ones
        await Count.destroy({ where: { scanID: latestScan.scanID }, transaction: t });

        scan = latestScan;
        // Optionally, update the timestamp if needed
        await scan.update({ timestamp }, { transaction: t });

      } else {
        // 3.2. If it's a different day, create a new scan
        scan = await Scan.create({ userID, timestamp, location }, { transaction: t });
      }
    }

    // 4. Insert the new devices
    const countRows = devices.map(device => ({
      scanID: scan.scanID,
      deviceID: device.deviceID,
      number: device.number
    }));

    await Count.bulkCreate(countRows, { transaction: t });

    await t.commit();
    res.status(200).json({ message: "Synced successfully", scanID: scan.scanID });

  } catch (err) {
    console.error(err);
    await t.rollback();
    res.status(500).json({ error: "Server error" });
  }
};

