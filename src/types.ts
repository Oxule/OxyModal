export type ModalContent = (close: ModalCallback, id: string)=>unknown;
export type ModalCallback = (data?: unknown)=>void;

export interface IModalContext {
    open: (content: ModalContent, callback?: ModalCallback, canClose? :boolean) => ({id: string, close: ModalCallback});
    close: (id: string) => void;
}

interface IModalState {
    content: unknown;
    close: (data?: unknown)=>void;
    canClose: boolean;
    opened: boolean;
    delete: ()=>void;
}

export type ModalCollection = {[key: string]:IModalState};