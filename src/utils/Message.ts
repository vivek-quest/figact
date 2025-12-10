
export type MessageType = 'info' | 'error' | 'warning' | 'success';

export type MessageOption = [string, string[]][] | string[];

export type MessageOptions = {
    title?: string;
    description?: string;
    type?: MessageType;
    options?: MessageOption;
};

export default class Message {
    public title: string;
    public description: string;
    public type: MessageType;
    public options: MessageOption;

    constructor({ title, description, type, options }: MessageOptions = {}) {
        this.title = title ?? '';
        this.description = description ?? '';
        this.type = type ?? 'info';
        this.options = options ?? [];
    }

    build() {
        const emoji = {
            info: 'ℹ️',
            error: '❌',
            warning: '⚠️',
            success: '✅',
        };

        const type = {
            info: 'Info',
            error: 'Error',
            warning: 'Warning',
            success: 'Success',
        };

        let response = '';

        if (this.type) response += `${emoji[this.type]} ${type[this.type]}: `;
        if (this.title) response += `${this.title}\n`;
        if (this.description) response += `${this.description}\n`;
        if (this.options?.length) {
            if (Array.isArray(this.options[0])) response += `${(this.options as [string, string[]][]).map(([k, v]) => `- ${k}:\n${v.map(s => `  • ${s}`).join('\n')}`).join('\n')}\n`;
            else response += `${this.options.map(s => `\t• ${s}`).join('\n')}\n`;
        }
        return response;
    }

    print() {
        console.log(this.build());
    }

    exit(code = this.type === 'error' ? 1 : 0) {
        this.print();
        process.exit(code);
    }

    static personalAccessTokenMissingTemplate() {
        return new Message({
            type: 'error',
            title: 'Missing Required Configuration',
            description: 'Personal Access Token is required but not provided.',
            options: [
                [
                    'You can provide it by',
                    [
                        'Adding "personalAccessToken" to your .figactrc file',
                        'Using --personal-access-token flag',
                    ]
                ]
            ]
        })
    }

    static fileKeyMissingTemplate() {
        return new Message({
            type: 'error',
            title: 'Missing Required Configuration',
            description: 'File Key is required but not provided.',
            options: [
                [
                    'You can provide it by',
                    [
                        'Adding "fileKey" to your .figactrc file',
                        'Using --file-key flag',
                    ]
                ]
            ]
        })
    }
}