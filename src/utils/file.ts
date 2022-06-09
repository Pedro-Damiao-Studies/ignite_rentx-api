import fs from 'fs';

async function deleteFile(filename: string): Promise<void> {
  try {
    await fs.promises.stat(filename);
  } catch {
    return undefined;
  }

  await fs.promises.unlink(filename);
  return undefined;
}

export { deleteFile };
