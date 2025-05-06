import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
let model = initModels(sequelize);
export const getAllReports = async (req, res) => {
  try {
    const reports = await model.Count.findAll({
      include: [
        {
          model: model.Scan,
          as: "scan",
          attributes: ["scanID", "timestamp", "location"],
          include: [
            {
              model: model.User,
              as: "user",
              attributes: ["userID", "name", "email", "role"],
            },
          ],
        },
        {
          model: model.Device,
          as: "device",
          attributes: ["deviceID", "deviceName", "description", "coordinates"],
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    console.error("❌ Error fetching reports:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching reports",
    });
  }
};
