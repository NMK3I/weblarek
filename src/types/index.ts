export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'card' | 'cash';
export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment | null;
    email: string;
    phone: string;
    address: string;
}

export interface IOrder extends IBuyer {
    total: number;
    items: string[];
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface IApiProductsResponse {
    total: number;
    items: IProduct[];
}

export interface IHeaderData {
    counter: number;
}

export interface IGalleryData {
    catalog: HTMLElement[];
}

export interface IModalData {
    content: HTMLElement;
}

export interface IBasketView {
    items: HTMLElement[];
    total: number;
    disabled: boolean;
}

export interface ISuccess {
    total: number;
}

export interface ICardActions {
    onClick: (e: MouseEvent) => void;
}

export interface ICardPreviewData extends IProduct {
    buttonText: string;
    buttonDisabled: boolean;
}

export interface ICardBasketData extends IProduct {
    index: number;
}

export interface IFormState {
    valid: boolean;
    errors: string[];
}

export interface IOrderForm {
    payment: TPayment | null;
    address: string;
}

export interface IContactsForm {
    email: string;
    phone: string;
}