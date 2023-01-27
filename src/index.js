class Flex {
    constructor(config) {
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.width = config.width || 0;
        this.height = config.height || 0;
    }
}

if (typeof window != 'undefined') {
    globalThis.Fbx = {
        Flex: Flex
    };
}

export { Flex };