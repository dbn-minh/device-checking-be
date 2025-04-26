import express from 'express';
import { syncDeviceData } from '../controllers/device.controller.js';

const router = express.Router();

router.post('/send', syncDeviceData);

export default router;
