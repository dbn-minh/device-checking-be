import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _Count from  "./Count.js";
import _Device from  "./Device.js";
import _Scan from  "./Scan.js";
import _User from  "./User.js";

export default function initModels(sequelize) {
  const Count = _Count.init(sequelize, DataTypes);
  const Device = _Device.init(sequelize, DataTypes);
  const Scan = _Scan.init(sequelize, DataTypes);
  const User = _User.init(sequelize, DataTypes);

  Count.belongsTo(Device, { as: "device", foreignKey: "deviceID"});
  Device.hasMany(Count, { as: "Counts", foreignKey: "deviceID"});
  Count.belongsTo(Scan, { as: "scan", foreignKey: "scanID"});
  Scan.hasMany(Count, { as: "Counts", foreignKey: "scanID"});
  Scan.belongsTo(User, { as: "user", foreignKey: "userID"});
  User.hasMany(Scan, { as: "Scans", foreignKey: "userID"});

  return {
    Count,
    Device,
    Scan,
    User,
  };
}
