"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDelayUnmount = useDelayUnmount;
const react_1 = require("react");
function useDelayUnmount(isMounted, delayTime) {
    const [shouldRender, setShouldRender] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        let timeoutId;
        if (isMounted && !shouldRender) {
            setShouldRender(true);
        }
        else if (!isMounted && shouldRender) {
            timeoutId = setTimeout(() => setShouldRender(false), delayTime);
        }
        return () => clearTimeout(timeoutId);
    }, [isMounted, delayTime, shouldRender]);
    return shouldRender;
}
