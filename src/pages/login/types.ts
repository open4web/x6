export interface LoginInput {
    phone?: string;
    password?: string;
    /** POS device credential from auth-api (replaces password for remembered login). */
    device_token?: string;
    step?: number;
    status?: number;
    remember?: boolean;
}

export type LoginSubmitResult = { ok: boolean; pending?: boolean };
