export const dUser
    = (id: string) => `<@${id}>`;

export const dRole
    = (id: string) => `<@&${id}>`;

export const dChannel
    = (id: string) => `<#${id}>`;

export const dLink
    = (name: string, link: string, embed?: boolean) => embed
        ? `[${name}](<${link}>)`
        : `[${name}](${link})`;

export const dHeader1
    = (txt: string) => `# ${txt}\n`;

export const dHeader2
    = (txt: string) => `## ${txt}\n`;

export const dHeader3
    = (txt: string) => `### ${txt}\n`;

export const dSubtext
    = (txt: string) => `-# ${txt}\n`;

export const dLines
    = (...lines: string[]) => lines.join('\n');

export const dCode
    = (txt: string) => `\`${txt}\``;

export const dCodeBlock
    = (txt: string, type: string = '') => `\`\`\`${type}\n${txt}\`\`\``;
