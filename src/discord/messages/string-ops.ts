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
    = (text: string) => `# ${text}\n`;

export const dHeader2
    = (text: string) => `## ${text}\n`;

export const dHeader3
    = (text: string) => `### ${text}\n`;

export const dSubtext
    = (text: string) => `-# ${text}\n`;
