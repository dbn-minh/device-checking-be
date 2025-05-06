import express from 'express';
import { syncDeviceData } from '../controllers/device.controller.js';
import {getAllReports} from "../controllers/admin.controller.js";

const router = express.Router();

router.post('/send', syncDeviceData);
// router.put('/devices', );
router.get('/reports', getAllReports);


export default router;
