import initModels from "../models/init-models.js";
import { sequelize } from "../config/database.js";

const model = initModels(sequelize);


export const syncDeviceData = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { timestamp, location, userID, devices } = req.body;

    if (!timestamp || !location || !userID || !devices) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const incomingDate = new Date(timestamp);
    console.log(incomingDate)

    // Step 1: Ensure all device names exist in Device table
    const deviceIDs = [];
    for (const device of devices) {
      let existingDevice = await model.Device.findOne({ where: { deviceName: device.deviceName }, transaction: t });
      if (!existingDevice) {
        existingDevice = await model.Device.create({ deviceName: device.deviceName }, { transaction: t });
      }
      deviceIDs.push({ deviceID: existingDevice.deviceID, number: device.number });
    }

    // Step 2: Check for the latest Scan entry
    const latestScan = await model.Scan.findOne({
      where: { userID, location },
      order: [["timestamp", "DESC"]],
      transaction: t
    });

    console.log(latestScan)

    let scan;
    if (!latestScan) {
      // No scan exists, create a new one
      scan = await model.Scan.create({ userID, timestamp, location }, { transaction: t });
    } else {
      const latestDate = new Date(latestScan.timestamp);

      // Require incoming timestamp to be later than existing
      if (incomingDate <= latestDate) {
        await t.rollback();
        return res.status(400).json({
          message: "Incoming timestamp must be later than the latest recorded scan."
        });
      }

      const isSameDay = (
        latestDate.getUTCFullYear() === incomingDate.getUTCFullYear() &&
        latestDate.getUTCMonth() === incomingDate.getUTCMonth() &&
        latestDate.getUTCDate() === incomingDate.getUTCDate()
      );

      if (isSameDay) {
        // Same day: overwrite
        await model.Count.destroy({ where: { scanID: latestScan.scanID }, transaction: t });
        scan = latestScan;
        await scan.update({ timestamp }, { transaction: t });
      } else {
        // Different day: create new scan
        scan = await model.Scan.create({ userID, timestamp, location }, { transaction: t });
      }
    }

    // Step 3: Fill the Count table
    const countRows = deviceIDs.map(d => ({
      scanID: scan.scanID,
      deviceID: d.deviceID,
      number: d.number
    }));

    await model.Count.bulkCreate(countRows, { transaction: t });

    await t.commit();
    res.status(200).json({ message: "Synced successfully", scanID: scan.scanID });

  } catch (err) {
    console.error(err);
    await t.rollback();
    res.status(500).json({ error: "Server error" });
  }
};

