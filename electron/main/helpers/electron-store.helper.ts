import Store from 'electron-store';

/**
 * Helper class for interacting with the Electron Store.
 */
export class ElectronStoreHelper {
	private static instance: ElectronStoreHelper | null = null;
	private store: Store;

	private constructor() {
		this.store = new Store();
	}

	/**
	 * Retrieves the singleton instance of ElectronStoreHelper.
	 * @returns {ElectronStoreHelper} The singleton instance.
	 */
	public static getInstance(): ElectronStoreHelper {
		if (!ElectronStoreHelper.instance) {
			ElectronStoreHelper.instance = new ElectronStoreHelper();
		}
		return ElectronStoreHelper.instance;
	}

	/**
	 * Sets a value in the Electron Store.
	 * @param {string} key - The key to set.
	 * @param {any} value - The value to set.
	 */
	set(key: string, value: any): void {
		this.store.set(key, value);
	}

	/**
	 * Retrieves a value from the Electron Store.
	 * @param {string} key - The key to retrieve.
	 * @returns {any} The retrieved value.
	 */
	get(key: string): any {
		return this.store.get(key);
	}

	/**
	 * Deletes a value from the Electron Store.
	 * @param {string} key - The key to delete.
	 */
	delete(key: string): void {
		this.store.delete(key);
	}
}
