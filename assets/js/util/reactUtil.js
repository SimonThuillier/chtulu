export function isFunctionalComponent(Component) {
    return (
        typeof Component === 'function' // can be various things
        && !(
            Component.prototype // native arrows don't have prototypes
            && Component.prototype.isReactComponent // special property
        )
    );
};

export function isClassComponent(Component) {
    return !!(
        typeof Component === 'function'
        && Component.prototype
        && Component.prototype.isReactComponent
    );
};