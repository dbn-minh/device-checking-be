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

    const formattedReports = reports.map((report) => {
    const { countID, number, device, scan } = report;
    const user = scan?.user;

    return {
      deviceID: device?.deviceID,
      deviceName: device?.deviceName,
      description: device?.description,
      coordinates: device?.coordinates,
      countID,
      number,
      scanID: scan?.scanID,
      timestamp: scan?.timestamp,
      location: scan?.location,

      user: user
        ? {
            userID: user.userID,
            name: user.name,
            email: user.email,
            role: user.role,
          }
        : null,
    };
  });


    res.status(200).json({
      success: true,
      data: formattedReports,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching reports",
    });
  }
};