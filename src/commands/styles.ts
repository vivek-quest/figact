import { Command } from 'commander';
import type { CLIStylesOptions } from '../types';
import Figma from '../utils/figma';
import FigmaUtils from '../utils/figmaUtils';
import { RequireKeys } from '../types/utils';
import * as fs from 'fs/promises';
import * as path from 'path';

export default async (cmdOpts: CLIStylesOptions, cmd: RequireKeys<Command, 'config'>) => {
    try {
        const { config } = cmd;
        
        cmdOpts.name &&= cmdOpts.name.toString().split(',');

        const css: string[] = [];

        const figma = new Figma({ personalAccessToken: config.personalAccessToken });

        const file = await figma.getFile(config.fileKey);

        const styles = Object.entries(file.styles).map(([id, style]) => ({ id, ...style }));

        for (const style of styles) {
            if (cmdOpts.type && cmdOpts.type !== style.styleType) continue;
            if (cmdOpts.name && !cmdOpts.name.includes(style.name)) continue;

            switch (style.styleType) {
                case 'FILL':
                    const node = Figma.findNodeDFS(file.document, (node) => node.styles?.fill === style.id);
                    if (!node) continue;

                    const className = FigmaUtils.toClassName(style.name, cmdOpts.prefix);
                    const cssValue = node.fills?.map(FigmaUtils.fillToCSSValue)?.filter(Boolean).join(', ');
                    if (!className || !cssValue) continue;

                    css.push(`.${className} { background: ${cssValue}; }`)
                    break;
            }
        }

        const outDir = path.resolve(process.cwd(), cmdOpts.outDir);
        
        await fs.mkdir(outDir, { recursive: true });
        await fs.writeFile(path.join(outDir, cmdOpts.filename), css.join('\n'), 'utf8');

        return;
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}