export class StorageHandler {
  constructor(key) {
    this.key = key;
  }

  readLocalStorage() {
    if(this.key === "")
      return null;

    return JSON.parse(localStorage.getItem(this.key)) || [];
  }

  writeLocalStorage(data) {
    if (this.key === "")
      return null

    if (typeof data !== 'string') {
      data = JSON.stringify(data);
    }

    localStorage.setItem(this.key, data);
  }
}