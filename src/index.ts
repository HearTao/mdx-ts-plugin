import typescript, { InferencePriority } from 'typescript/lib/tsserverlibrary';

function init(modules: { typescript: typeof typescript }) {
    const ts = modules.typescript;

    function create(info: ts.server.PluginCreateInfo) {
        const proxy: ts.LanguageService = Object.create(null);
        for (let k of Object.keys(info.languageService) as Array<
            keyof ts.LanguageService
        >) {
            (proxy[k] as any) = (...args: any[]) =>
                (info.languageService[k] as any).apply(
                    info.languageService,
                    args
                );
        }

        const host = info.languageServiceHost;

        const originalResolveModuleNames = host.resolveModuleNames;
        host.resolveModuleNames = (moduleNames, containingFile, ...args) => {
            const newModules = moduleNames.map(x => {
                if (x.endsWith('.mdx')) {
                    return (
                        x.slice(0, x.length - '.mdx'.length) +
                        '.virtual-file.mdx'
                    );
                }
                return x;
            });

            const result =
                originalResolveModuleNames?.call(
                    host,
                    newModules,
                    containingFile,
                    ...args
                ) ?? [];
            info.project.projectService.logger.info(
                'moduleNames: ' + JSON.stringify(moduleNames)
            );
            info.project.projectService.logger.info(
                'newModules: ' + JSON.stringify(newModules)
            );
            info.project.projectService.logger.info(
                'resolveModuleNames: ' + JSON.stringify(result)
            );
            return result;
        };

        const originalReadFile = host.readFile;
        host.readFile = (path, encoding) => {
            info.project.projectService.logger.info(
                'readFile: ' + JSON.stringify(path)
            );

            if (path.endsWith('.virtual-file.mdx.tsx')) {
                return originalReadFile?.call(
                    host,
                    path.slice(
                        0,
                        path.length - '.virtual-file.mdx.tsx'.length
                    ) + '.mdx',
                    encoding
                );
            }

            return originalReadFile?.call(host, path, encoding);
        };

        const originalReadDirectory = host.readDirectory;
        host.readDirectory = (path, extensions, ...args) => {
            info.project.projectService.logger.info(
                'readDirectory: ' + JSON.stringify(path)
            );
            const originalResult =
                originalReadDirectory?.call(
                    host,
                    path,
                    [...(extensions || []), '.mdx'],
                    ...args
                ) ?? [];

            return originalResult.map(x => {
                if (x.endsWith('.mdx')) {
                    return (
                        x.slice(0, x.length - '.mdx'.length) +
                        '.virtual-file.mdx.tsx'
                    );
                }
                return x;
            });
        };

        const originalFileExists = host.fileExists;
        host.fileExists = path => {
            info.project.projectService.logger.info(
                'fileExists: ' + JSON.stringify(path)
            );
            if (path.endsWith('.virtual-file.mdx.tsx')) {
                return !!originalFileExists?.call(
                    host,
                    path.slice(
                        0,
                        path.length - '.virtual-file.mdx.tsx'.length
                    ) + '.mdx'
                );
            }

            return !!originalFileExists?.call(host, path);
        };

        const originWatchFile = info.serverHost.watchFile;
        info.serverHost.watchFile = (path, callback, ...args) => {
            info.project.projectService.logger.info(
                'watchFile: ' + JSON.stringify(path)
            );
            if (path.endsWith('.virtual-file.mdx.tsx')) {
                const wrapperCallback: typeof callback = (filename, ...a) => {
                    callback(
                        filename.slice(0, filename.length - '.mdx'.length) +
                            '.virtual-file.mdx.tsx',
                        ...a
                    );
                };
                return originWatchFile.call(
                    info.serverHost,
                    path.slice(
                        0,
                        path.length - '.virtual-file.mdx.tsx'.length
                    ) + '.mdx',
                    wrapperCallback,
                    ...args
                );
            }
            return originWatchFile.call(
                info.serverHost,
                path,
                callback,
                ...args
            );
        };
        info.project.projectService.logger.info(
            'Object keys: ' + Object.keys(host)
        );

        const originalServerReadFile = info.serverHost.readFile;
        info.serverHost.readFile = (path, encoding) => {
            info.project.projectService.logger.info(
                'serverHostReadFile: ' + JSON.stringify(path)
            );

            if (path.endsWith('.virtual-file.mdx.tsx')) {
                return originalServerReadFile?.call(
                    host,
                    path.slice(
                        0,
                        path.length - '.virtual-file.mdx.tsx'.length
                    ) + '.mdx',
                    encoding
                );
            }

            return originalServerReadFile?.call(host, path, encoding);
        };

        const originalServerFileExists = info.serverHost.fileExists;
        info.serverHost.fileExists = path => {
            info.project.projectService.logger.info(
                'serverHostfileExists: ' + JSON.stringify(path)
            );

            if (path.endsWith('.virtual-file.mdx.tsx')) {
                return originalServerFileExists?.call(
                    host,
                    path.slice(
                        0,
                        path.length - '.virtual-file.mdx.tsx'.length
                    ) + '.mdx'
                );
            }

            return originalServerFileExists?.call(host, path);
        };

        return proxy;
    }

    return { create };
}

export = init;
