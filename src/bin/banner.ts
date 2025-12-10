import chalk from 'chalk';
import pkg from '../../package.json' ;

export const bigBanner = `
${chalk.cyan('╔═══════════════════════════════════════════════════════════╗')}
${chalk.cyan('║')}                                                           ${chalk.cyan('║')}
${chalk.cyan('║')}     ${chalk.bold.magenta('███████╗██╗ ██████╗  █████╗  ██████╗████████╗')}         ${chalk.cyan('║')}
${chalk.cyan('║')}     ${chalk.bold.magenta('██╔════╝██║██╔════╝ ██╔══██╗██╔════╝╚══██╔══╝')}         ${chalk.cyan('║')}
${chalk.cyan('║')}     ${chalk.bold.magenta('█████╗  ██║██║  ███╗███████║██║        ██║   ')}         ${chalk.cyan('║')}
${chalk.cyan('║')}     ${chalk.bold.magenta('██╔══╝  ██║██║   ██║██╔══██║██║        ██║   ')}         ${chalk.cyan('║')}
${chalk.cyan('║')}     ${chalk.bold.magenta('██║     ██║╚██████╔╝██║  ██║╚██████╗   ██║   ')}         ${chalk.cyan('║')}
${chalk.cyan('║')}     ${chalk.bold.magenta('╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝   ╚═╝   ')}         ${chalk.cyan('║')}
${chalk.cyan('║')}                                                           ${chalk.cyan('║')}
${chalk.cyan('║')}           ${chalk.bold.white('Figma')} ${chalk.gray('→')} ${chalk.bold.blue('React')} ${chalk.gray('|')} ${chalk.dim('Transform designs into code')}     ${chalk.cyan('║')}
${chalk.cyan('║')}           ${chalk.dim(`v${pkg.version}`)}                                          ${chalk.cyan('║')}
${chalk.cyan('║')}                                                           ${chalk.cyan('║')}
${chalk.cyan('╚═══════════════════════════════════════════════════════════╝')}
`;

