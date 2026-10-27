export interface LoginInput {
    phone?: string;
    password?: string;
    step?: number;
    status?: number;
    remember?: boolean;
}

export type LoginSubmitResult = { ok: boolean; pending?: boolean };