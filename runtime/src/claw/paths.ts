import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Repo root: .../runtime/src/claw → ../../../ */
export function getDefaultRepoRoot(): string {
  return join(__dirname, '..', '..', '..');
}
