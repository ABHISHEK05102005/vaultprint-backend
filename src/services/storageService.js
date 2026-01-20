const fs = require('fs');
const path = require('path');

const DATA_ROOT = process.env.KIOSK_DATA_ROOT || path.join(__dirname, '..', '..', 'kiosks');

// Ensure base directory exists
if (!fs.existsSync(DATA_ROOT)) {
  fs.mkdirSync(DATA_ROOT, { recursive: true });
}

function getKioskDir(kioskId) {
  return path.join(DATA_ROOT, String(kioskId));
}

function getMetadataPath(kioskId) {
  return path.join(getKioskDir(kioskId), 'jobs.json');
}

function readMetadata(kioskId) {
  const metaPath = getMetadataPath(kioskId);
  if (!fs.existsSync(metaPath)) return [];
  const raw = fs.readFileSync(metaPath, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeMetadata(kioskId, jobs) {
  const dir = getKioskDir(kioskId);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const metaPath = getMetadataPath(kioskId);
  fs.writeFileSync(metaPath, JSON.stringify(jobs, null, 2), 'utf-8');
}

exports.saveKioskJob = async ({ kioskId, fileBuffer, fileName, customization, otp }) => {
  const kioskDir = getKioskDir(kioskId);
  if (!fs.existsSync(kioskDir)) {
    fs.mkdirSync(kioskDir, { recursive: true });
  }

  const filePath = path.join(kioskDir, fileName);
  fs.writeFileSync(filePath, fileBuffer);

  const jobs = readMetadata(kioskId);
  jobs.push({
    kioskId,
    otp,
    fileName,
    filePath,
    customization,
    createdAt: new Date().toISOString()
  });
  writeMetadata(kioskId, jobs);

  return { kioskId, otp, fileName, filePath };
};

exports.getKioskJobByOtp = async (kioskId, otp) => {
  const jobs = readMetadata(kioskId);
  return jobs.find((job) => job.otp === otp) || null;
};

exports.deleteKioskJob = async (job) => {
  const { kioskId, otp, filePath } = job;

  // Delete file
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // Remove from metadata
  const jobs = readMetadata(kioskId).filter((j) => j.otp !== otp);

  // If no jobs left, clean entire kiosk folder
  if (jobs.length === 0) {
    const dir = getKioskDir(kioskId);
    if (fs.existsSync(dir)) {
      // Remove all files then directory
      fs.readdirSync(dir).forEach((f) => {
        fs.unlinkSync(path.join(dir, f));
      });
      fs.rmdirSync(dir);
    }
  } else {
    writeMetadata(kioskId, jobs);
  }
};

