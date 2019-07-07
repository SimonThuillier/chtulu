export const splitCssLength = cssLength => {
    const regex = new RegExp("^(\\d+)(\\w*)");
    let res = regex.exec(cssLength);
    return {
        length: +res[0],
        unit: res[1] !== "" && res[1] !== null ? res[1] : "px"
    };
};

export const cssizePropertyName = name => {
    if (name === name.toLowerCase()) return name;

    let newName = ``;

    for (let i = 0; i < name.length; i++) {
        let char = name.charAt(i);
        if (char.toLowerCase() === char) {
            newName = newName + char;
        } else {
            newName = newName + `-` + char.toLowerCase();
        }
    }
    return newName;
};

export const getInlinedCss = theme => {
    let css = ``;
    Object.keys(theme).forEach(k => {
        css = css + `${cssizePropertyName(k)} : ${theme[k]};\r\n`;
    });
    return css;
};
