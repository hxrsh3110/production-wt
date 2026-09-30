// ApexFit Studio OS - Native Buffers, Streams, and File System Engine (Exp 7)
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const LOG_FILE = path.join(ROOT_DIR, 'training_session.log');
const SOURCE_FILE = path.join(ROOT_DIR, 'volume_data_source.txt');
const ARCHIVE_FILE = path.join(ROOT_DIR, 'volume_data_archive.txt');

export const streamService = {
  // Append workout log event to disk (Exp 7 fs.appendFile)
  async appendWorkoutLog(athlete, exercise, weight, reps, volume) {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] EVENT: Athlete ${athlete} completed ${reps} reps of ${exercise} @ ${weight}kg (Volume: ${volume}kg)\n`;
    try {
      await fsp.appendFile(LOG_FILE, line, 'utf8');
      return { success: true, file: LOG_FILE, line };
    } catch (err) {
      console.error("Failed to append workout log:", err);
      throw err;
    }
  },

  // Read raw log file from disk (Exp 7 fs.readFile)
  async readWorkoutLogs() {
    try {
      if (!fs.existsSync(LOG_FILE)) {
        return "No training session logs written to disk yet. Log workouts via Active Floor.";
      }
      return await fsp.readFile(LOG_FILE, 'utf8');
    } catch (err) {
      console.error("Failed to read workout logs:", err);
      throw err;
    }
  },

  // Pipe readable stream to writable stream with buffer chunks (Exp 7)
  async pipeVolumeStream(customData) {
    return new Promise((resolve, reject) => {
      const dataToStream = customData || 
        `Set 1: 140kg x 3 reps\nSet 2: 140kg x 3 reps\nSet 3: 140kg x 3 reps\nSet 4: 140kg x 3 reps\nSet 5: 140kg x 3 reps\n[Archived at: ${new Date().toISOString()}]\n`;

      fs.writeFileSync(SOURCE_FILE, dataToStream, 'utf8');

      const readableStream = fs.createReadStream(SOURCE_FILE, { encoding: 'utf8', highWaterMark: 32 });
      const writableStream = fs.createWriteStream(ARCHIVE_FILE);

      const chunks = [];

      readableStream.on('data', (chunk) => {
        chunks.push(`Chunk (${chunk.length} bytes): ${chunk.trim()}`);
      });

      readableStream.pipe(writableStream);

      writableStream.on('finish', () => {
        resolve({
          success: true,
          message: "Data successfully streamed and piped from source to archive file.",
          sourcePath: SOURCE_FILE,
          archivePath: ARCHIVE_FILE,
          chunkCount: chunks.length,
          chunks
        });
      });

      readableStream.on('error', reject);
      writableStream.on('error', reject);
    });
  }
};
