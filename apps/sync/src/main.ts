import { syncKanjiAttributes } from './app/sync';
const args = process.argv.slice(2);

const file = args[0];
if (file) {
    syncKanjiAttributes(file);
}
