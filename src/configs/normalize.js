export const normalizePath = (filePath) => {
    if (!filePath) return '';
    return filePath.replace(/\\/g, '/');
};

export const normalizeBaseUrl = (baseUrl) => {
    if (!baseUrl) return '';
    return baseUrl.replace(/\/$/, '');
};