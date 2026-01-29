import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Scrape hoodies from external source
// @route   GET /api/external/scrape
// @access  Public
router.get('/scrape', (req, res) => {
    const scriptPath = path.join(__dirname, '../scripts/scrape_hoodies.py');
    // Use the virtual environment python executable
    const pythonExecutable = path.join(__dirname, '../venv/bin/python');
    
    const pythonProcess = spawn(pythonExecutable, [scriptPath]);
    
    pythonProcess.on('error', (err) => {
        console.error('Failed to start python process:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to execute scraper script',
            error: err.message
        });
    });
    
    let dataString = '';

    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).json({ 
                success: false, 
                message: 'Scraping failed',
                error: 'Process exited with code ' + code 
            });
        }
        
        try {
            const results = JSON.parse(dataString);
            res.status(200).json({
                success: true,
                count: results.length,
                data: results
            });
        } catch (e) {
            res.status(500).json({
                success: false,
                message: 'Failed to parse scraping results',
                error: e.message,
                raw: dataString
            });
        }
    });
});

export default router;
