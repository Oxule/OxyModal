import {cloneElement, createContext, useContext, useEffect, useState} from "react";
import closeIconDefault from "./media/close.svg";
import {useDelayUnmount} from "./useDelayUnmount";
import type {ModalCollection, ModalContent, ModalCallback, IModalContext} from "./types";
import React from "react";

const ModalContext = createContext<[ModalCollection, (value: (((prevState: ModalCollection) => ModalCollection) | ModalCollection)) => void] | null>(null);

function Modal({children, id, canClose, close, closeIcon, opened, animationDelay, onDelete}){

    const handleBackgroundClick = (e) => {
        if (e.target.classList.contains("oxymodal-background")) {
            close();
        }
    };

    useEffect(() => {
        const handleBackButton = (e) => {
            e.preventDefault();
            close();
        };

        window.addEventListener("popstate", handleBackButton);

        return () => {
            window.removeEventListener("popstate", handleBackButton);
        };
    }, [close]);

    const shouldRender = useDelayUnmount(opened, animationDelay);

    const openAnimationPanel = { animation: `oxymodal-panel-open ${animationDelay}ms ease-in` };
    const closeAnimationPanel = { animation: `oxymodal-panel-close ${animationDelay*1.25}ms ease-in` };

    const panelAnimation = opened?openAnimationPanel:closeAnimationPanel;

    const openAnimationBackground = { animation: `oxymodal-background-open ${animationDelay}ms ease-in` };
    const closeAnimationBackground = { animation: `oxymodal-background-close ${animationDelay*1.25}ms ease-in` };

    const backgroundAnimation = opened?openAnimationBackground:closeAnimationBackground;

    useEffect(() => {
        if(!opened && !shouldRender)
            onDelete(id);
    }, [shouldRender]);

    if(!shouldRender){
        return;
    }

    return <div className={"oxymodal-background"} style={{position: "absolute", width: "100vw", height: "100vh", left: "0", right: "0", top: "0", bottom: "0", ...backgroundAnimation}} onClick={handleBackgroundClick}>
        <div className={"oxymodal-panel"} style={panelAnimation}>
            {children}
        </div>
        {canClose && cloneElement(closeIcon, {
            className: "oxymodal-button-close",
            onClick: ()=>close(),
            style: {...backgroundAnimation}
        })}
    </div>
}

export function ModalProvider({children, closeIcon = <img src={closeIconDefault}/>, animationDelay = 150}) {
    const modals = useState<ModalCollection>({});

    return <ModalContext.Provider value={modals}>
        {children}
        <>
            {Object.entries(modals[0]).map(x=>
                <Modal id={x[0]}
                       key={x[0]}
                       canClose={x[1].canClose}
                       close={x[1].close}
                       closeIcon={closeIcon}
                       opened={x[1].opened}
                       animationDelay={animationDelay}
                       onDelete={x[1].delete}
                >{x[1].content}</Modal>)}
        </>
    </ModalContext.Provider>
}

export function useModal():IModalContext {
    const [modals, setModals] = useContext(ModalContext);

    function close(id: string) {
        setModals(x=>({...x, [id]: {...x[id], opened: false}}));
    }

    return {
        open: (content: ModalContent, callback: ModalCallback = ()=>{}, canClose: boolean = true) => {
            const uuid = crypto.randomUUID();

            const closeFunc = (data?: unknown)=>{
                if(callback)
                    callback(data);
                close(uuid);
            };

            const deleteFunction = ()=>setModals(x=>{
                const { [uuid]: _, ...rest } = x;
                return rest;
            });

            setModals(x=>({...x, [uuid]: {content: content(closeFunc, uuid), close: closeFunc, canClose: canClose, opened: true, delete: deleteFunction}}));

            return {id: uuid, close: closeFunc};
        },
        close: close
    }
}