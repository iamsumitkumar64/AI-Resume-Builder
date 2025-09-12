import type { ColumnsType } from "antd/es/table";

interface modalProps {
    content: string,
    title: string,
    open?: boolean,
    onCancel?: () => void;
}

interface CustomTableProps<T extends { id?: string | number }> {
    serialNumberConfig?: {
        show: boolean;
        name?: string;
    };
    columns: ColumnsType<T>;
    data: T[];
    loading?: boolean;
    onPageChange?: (page: number, pageSize: number) => void;
}

interface AuthFormProps {
    title: string;
    buttonText?: string;
    showContactAdmin?: boolean;
    contactAdminAction?: () => void;
    onSuccess?: (data: any) => void;
    form?: any;
    api: string;
    redirectTo?: string;
}

interface HeaderProps {
    title_of_page: string;
}

interface LayoutWrapperProps {
    title: string;
    children: React.ReactNode;
}


interface profileViewerProps {
    open?: boolean;
    onClose?: () => void;
    profileData: any;
    profileEmail: string;
}

export type {
    modalProps,
    CustomTableProps,
    AuthFormProps,
    HeaderProps,
    LayoutWrapperProps,
    profileViewerProps
}