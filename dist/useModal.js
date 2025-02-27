"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalProvider = ModalProvider;
exports.useModal = useModal;
const react_1 = require("react");
const close_svg_1 = __importDefault(require("./media/close.svg"));
const useDelayUnmount_1 = require("./useDelayUnmount");
const react_2 = __importDefault(require("react"));
const ModalContext = (0, react_1.createContext)(null);
function Modal({ children, id, canClose, close, closeIcon, opened, animationDelay, onDelete }) {
    const handleBackgroundClick = (e) => {
        if (e.target.classList.contains("oxymodal-background")) {
            close();
        }
    };
    (0, react_1.useEffect)(() => {
        const handleBackButton = (e) => {
            e.preventDefault();
            close();
        };
        window.addEventListener("popstate", handleBackButton);
        return () => {
            window.removeEventListener("popstate", handleBackButton);
        };
    }, [close]);
    const shouldRender = (0, useDelayUnmount_1.useDelayUnmount)(opened, animationDelay);
    const openAnimationPanel = { animation: `oxymodal-panel-open ${animationDelay}ms ease-in` };
    const closeAnimationPanel = { animation: `oxymodal-panel-close ${animationDelay * 1.25}ms ease-in` };
    const panelAnimation = opened ? openAnimationPanel : closeAnimationPanel;
    const openAnimationBackground = { animation: `oxymodal-background-open ${animationDelay}ms ease-in` };
    const closeAnimationBackground = { animation: `oxymodal-background-close ${animationDelay * 1.25}ms ease-in` };
    const backgroundAnimation = opened ? openAnimationBackground : closeAnimationBackground;
    (0, react_1.useEffect)(() => {
        if (!opened && !shouldRender)
            onDelete(id);
    }, [shouldRender]);
    if (!shouldRender) {
        return;
    }
    return react_2.default.createElement("div", { className: "oxymodal-background", style: { position: "absolute", width: "100vw", height: "100vh", left: "0", right: "0", top: "0", bottom: "0", ...backgroundAnimation }, onClick: handleBackgroundClick },
        react_2.default.createElement("div", { className: "oxymodal-panel", style: panelAnimation }, children),
        canClose && (0, react_1.cloneElement)(closeIcon, {
            className: "oxymodal-button-close",
            onClick: () => close(),
            style: { ...backgroundAnimation }
        }));
}
function ModalProvider({ children, closeIcon = react_2.default.createElement("img", { src: close_svg_1.default }), animationDelay = 150 }) {
    const modals = (0, react_1.useState)({});
    return react_2.default.createElement(ModalContext.Provider, { value: modals },
        children,
        react_2.default.createElement(react_2.default.Fragment, null, Object.entries(modals[0]).map(x => react_2.default.createElement(Modal, { id: x[0], key: x[0], canClose: x[1].canClose, close: x[1].close, closeIcon: closeIcon, opened: x[1].opened, animationDelay: animationDelay, onDelete: x[1].delete }, x[1].content))));
}
function useModal() {
    const [modals, setModals] = (0, react_1.useContext)(ModalContext);
    function close(id) {
        setModals(x => ({ ...x, [id]: { ...x[id], opened: false } }));
    }
    return {
        open: (content, callback = () => { }, canClose = true) => {
            const uuid = crypto.randomUUID();
            const closeFunc = (data) => {
                if (callback)
                    callback(data);
                close(uuid);
            };
            const deleteFunction = () => setModals(x => {
                const { [uuid]: _, ...rest } = x;
                return rest;
            });
            setModals(x => ({ ...x, [uuid]: { content: content(closeFunc, uuid), close: closeFunc, canClose: canClose, opened: true, delete: deleteFunction } }));
            return { id: uuid, close: closeFunc };
        },
        close: close
    };
}
