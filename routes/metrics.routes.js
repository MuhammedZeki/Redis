import express from 'express';
import { metrics } from '../metrics/counters.js';
const router = express.Router()

router.get("/", (req, res) => { res.json(metrics) })


export default router
