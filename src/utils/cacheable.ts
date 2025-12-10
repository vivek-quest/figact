import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';

export type CacheControl = {
    cache?: boolean;
    force?: boolean;
};

export type CacheStorage = 'memory' | 'file' | 'both';

export type CacheOptions = {
    exclude?: string[];
    include?: string[];
    getKey?: (method: string, ...args: any[]) => string;
    cache?: boolean;
    force?: boolean;
    storage?: CacheStorage;
    cacheDir?: string;
    ttl?: number; // Time to live in milliseconds
};

type CacheEntry = {
    value: any;
    timestamp: number;
};

export default class Cacheable {
    protected cache: Map<string, CacheEntry> = new Map();
    private storage: CacheStorage;
    private cacheDir: string;
    private ttl?: number;

    constructor({
        exclude = [],
        include = [],
        getKey = (method: string, ...args: any[]) => JSON.stringify([method, ...args]),
        cache = true,
        force = false,
        storage = 'memory',
        cacheDir = path.join(os.tmpdir(), 'cacheable'),
        ttl
    }: CacheOptions = {}) {
        this.storage = storage;
        this.cacheDir = cacheDir;
        this.ttl = ttl;

        if (storage === 'file' || storage === 'both') {
            this.initCacheDir();
        }

        const proto = Object.getPrototypeOf(this);
        for (const methodName of Object.getOwnPropertyNames(proto)) {
            const descriptor = Object.getOwnPropertyDescriptor(proto, methodName);
            if (!descriptor || typeof descriptor.value !== "function") continue;
            if (methodName === "constructor") continue;
            if (exclude.includes(methodName)) continue;
            if (include.length > 0 && !include.includes(methodName)) continue;

            const originalFn = descriptor.value.bind(this);
            const wrapped = async (...args: any[]) => {
                const lastArg = args[args.length - 1];
                const control: CacheControl = lastArg?.cacheControl ?? { cache, force };
                const cacheKey = getKey(methodName, ...args);

                if (control.force) {
                    await this.deleteCache(cacheKey);
                }

                if (control.cache) {
                    const cached = await this.getCache(cacheKey);
                    if (cached !== undefined) {
                        return cached;
                    }
                }

                const result = await originalFn(...args);

                if (control.cache) {
                    await this.setCache(cacheKey, result);
                }

                return result;
            };

            Object.defineProperty(this, methodName, {
                value: wrapped,
                writable: true,
                configurable: true
            });
        }
    }

    private async initCacheDir(): Promise<void> {
        try {
            await fs.mkdir(this.cacheDir, { recursive: true });
        } catch (error) {
            console.error('Failed to create cache directory:', error);
        }
    }

    private getFilePath(key: string): string {
        const hash = crypto.createHash('sha256').update(key).digest('hex');
        return path.join(this.cacheDir, `${hash}.json`);
    }

    private isExpired(timestamp: number): boolean {
        if (!this.ttl) return false;
        return Date.now() - timestamp > this.ttl;
    }

    private async getCache(key: string): Promise<any> {
        if (this.storage === 'memory' || this.storage === 'both') {
            const entry = this.cache.get(key);
            if (entry && !this.isExpired(entry.timestamp)) {
                return entry.value;
            }
            if (entry && this.isExpired(entry.timestamp)) {
                this.cache.delete(key);
            }
        }

        if (this.storage === 'file' || this.storage === 'both') {
            try {
                const filePath = this.getFilePath(key);
                const data = await fs.readFile(filePath, 'utf-8');
                const entry: CacheEntry = JSON.parse(data);
                
                if (this.isExpired(entry.timestamp)) {
                    await fs.unlink(filePath).catch(() => {});
                    return undefined;
                }

                if (this.storage === 'both') {
                    this.cache.set(key, entry);
                }

                return entry.value;
            } catch (error) {
                return undefined;
            }
        }

        return undefined;
    }

    private async setCache(key: string, value: any): Promise<void> {
        const entry: CacheEntry = {
            value,
            timestamp: Date.now()
        };

        if (this.storage === 'memory' || this.storage === 'both') {
            this.cache.set(key, entry);
        }

        if (this.storage === 'file' || this.storage === 'both') {
            try {
                const filePath = this.getFilePath(key);
                await fs.writeFile(filePath, JSON.stringify(entry), 'utf-8');
            } catch (error) {
                console.error('Failed to write cache file:', error);
            }
        }
    }

    private async deleteCache(key: string): Promise<void> {
        if (this.storage === 'memory' || this.storage === 'both') {
            this.cache.delete(key);
        }

        if (this.storage === 'file' || this.storage === 'both') {
            try {
                const filePath = this.getFilePath(key);
                await fs.unlink(filePath).catch(() => {});
            } catch (error) {
            }
        }
    }

    async clearCache(): Promise<void> {
        this.cache.clear();

        if (this.storage === 'file' || this.storage === 'both') {
            try {
                const files = await fs.readdir(this.cacheDir);
                await Promise.all(
                    files.map(file => 
                        fs.unlink(path.join(this.cacheDir, file)).catch(() => {})
                    )
                );
            } catch (error) {
                console.error('Failed to clear cache directory:', error);
            }
        }
    }

    async getCacheStats(): Promise<{ memory: number; files: number }> {
        const memoryCount = this.cache.size;
        let filesCount = 0;

        if (this.storage === 'file' || this.storage === 'both') {
            try {
                const files = await fs.readdir(this.cacheDir);
                filesCount = files.length;
            } catch (error) {
            }
        }

        return { memory: memoryCount, files: filesCount };
    }
}