type AdminSchema = {
    adminname: string;
    email: string;
    mobile?: string;
    role?: string;
    active?: string;
};

interface rawData {
    role: string;
    email: string;
    mobile: string;
    createdAt: Date;
    id: string;
    active: boolean;
    sentforapproval: boolean;
    approvedByAdmin: number;
    rejectionCount: number;
}

export type { AdminSchema, rawData };