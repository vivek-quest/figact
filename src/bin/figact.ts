#!/usr/bin/env node
import path from 'path';
import fs from 'fs';
import { Command } from 'commander';
import pkg from '../../package.json';
import type { CLICommonOptions, FigActConfig } from '../types';
import * as commands from '../commands';
import  'dotenv/config';
import { OptionalKeys } from '../types/utils';
import Message from '../utils/Message';
import { bigBanner } from './banner';

const loadConfig = (thisCommand: Command, actionCommand: Command) => {
    const opts = thisCommand.opts<CLICommonOptions>();

    let config: OptionalKeys<FigActConfig, 'personalAccessToken' | 'fileKey'> = {};

    opts.config ||= path.resolve(process.cwd(), '.figactrc');
    
    if (fs.existsSync(opts.config)) {
        const raw = fs.readFileSync(opts.config, 'utf8');
        config = JSON.parse(raw) as FigActConfig;
    }

    if (opts.personalAccessToken) config.personalAccessToken = opts.personalAccessToken;
    if (opts.fileKey) config.fileKey = opts.fileKey;

    const resolveRecurssive = (config: Record<string, any>) => {
        for (let key in config) {
            if (typeof config[key] === 'string' && config[key].startsWith('$')) {
                config[key] = process.env[config[key].slice(1)] ?? config[key];
            } else if (typeof config[key] === 'object') {
                resolveRecurssive(config[key]);
            }
        }
    }

    resolveRecurssive(config);

    if (!config.personalAccessToken) Message.templates.personalAccessTokenMissing().exit()
    if (!config.fileKey) Message.templates.fileKeyMissing().exit()

    actionCommand.config = config as FigActConfig;
}

const program = new Command();

program
    .name('figact')
    .description('Figma → React CLI (figact)')
    .version(pkg.version)
    .option('--config <path>', 'path to .figactrc JSON file (overrides default in project root)')
    .option('--personal-access-token <token>', 'Figma personal access token (overrides config.personalAccessToken)')
    .option('--file-key <key>', 'Figma file key (overrides config.fileKey)')
    .option('--no-cache', 'disable caching', true)
    .addHelpText('beforeAll', bigBanner)

program.hook('preAction', loadConfig);

program
    .command('styles')
    .description('Generate style files from Figma')
    .option('--type <type>', 'style type to generate (FILL, TEXT, EFFECT)')
    .option('--name <name>', 'comma separated names of the style')
    .option('--outDir <dir>', 'output directory', './figact/styles')
    .option('--filename <filename>', 'output filename', 'styles.css')
    .option('--prefix <prefix>', 'prefix for class names')
    .action(commands.styles);

program.parse(process.argv);
