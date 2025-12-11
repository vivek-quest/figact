import axios, { AxiosInstance } from 'axios';
import Cacheable from './cacheable';
import type { GetFileResponse, GetFileNodesResponse, GetFileStylesResponse, GetStyleResponse, File, Style, Node, FileNodes } from '../types/figma';

type FigmaOptions = {
    personalAccessToken: string;
};

export default class Figma extends Cacheable {
    axios: AxiosInstance;
    personalAccessToken: string;

    constructor({ personalAccessToken }: Partial<FigmaOptions> = {}) {
        super({ 
            storage: 'memory',
            ttl: 1000 * 60 * 60 // 1 hour
        });

        if (!personalAccessToken) throw new Error("personalAccessToken is required");
        this.personalAccessToken = personalAccessToken;

        this.axios = axios.create({
            baseURL: "https://api.figma.com/v1",
            headers: { "X-Figma-Token": personalAccessToken }
        });
    }

    async getFile(fileKey: string, {} = {}): Promise<File> {
        try {
            const response = await this.axios.get<GetFileResponse>(`/files/${fileKey}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) throw error.response?.data;
            throw error;
        }
    }

    async getFileNodes(fileKey: string, { ids }: { ids?: string } = {}): Promise<FileNodes> {
        try {
            const response = await this.axios.get<GetFileNodesResponse>(`/files/${fileKey}/nodes`, { params: { ids } });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) throw error.response?.data;
            throw error;
        }
    }

    async getFileStyles(fileKey: string, {} = {}): Promise<Style[]> {
        try {
            const response = await this.axios.get<GetFileStylesResponse>(`/files/${fileKey}/styles`);
            if (response.data.error) throw new Error('Failed to fetch file styles');
            return response.data.meta.styles;
        } catch (error) {
            if (axios.isAxiosError(error)) throw error.response?.data;
            throw error;
        }
    }

    async getStyles(styleKey: string, {} = {}): Promise<Style> {
        try {
            const response = await this.axios.get<GetStyleResponse>(`/styles/${styleKey}`);
            if (response.data.error) throw new Error('Failed to fetch style');
            return response.data.meta;
        } catch (error) {
            if (axios.isAxiosError(error)) throw error.response?.data;
            throw error;
        }
    }

    static findNodeDFS(root: Node, callback: (node: Node) => boolean): Node | null {
        if (callback(root)) return root;
        for (const child of root.children ?? []) {
            const result = this.findNodeDFS(child, callback);
            if (result) return result;
        }
        return null;
    }

    static findAllNodesDFS(root: Node, callback: (node: Node) => boolean): Node[] {
        const results = [];
        if (callback(root)) results.push(root);
        for (const child of root.children ?? []) {
            results.push(...this.findAllNodesDFS(child, callback));
        }
        return results;
    }

    static traverseNodeDFS(root: Node, callback: (node: Node) => void) {
        callback(root);
        for (const child of root.children ?? []) {
            this.traverseNodeDFS(child, callback);
        }
    }
}