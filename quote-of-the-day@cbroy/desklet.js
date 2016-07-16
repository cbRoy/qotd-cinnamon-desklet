
const UUID = 'quote-of-the-day@cbroy';
const DESKLET_DIR = imports.ui.deskletManager.deskletMeta[UUID].path;
imports.searchPath.push(DESKLET_DIR);
const qotd = imports.main;

function main(metadata, desklet_id){
  return new qotd.QotDDesklet(metadata, desklet_id);
}
