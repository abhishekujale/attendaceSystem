declare module 'qrcode' {
    export function toDataURL(data: string, options?: object): Promise<string>;
}
