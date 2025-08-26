interface profile_form_Schema {
    firstName: string;
    middleName?: string;
    lastName: string;
    organization: string;
    role: string;
    phoneNumber: string;
    city: string;
    area: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    otherSocials?: string;
    introduction: string;
    quote: string;
    joy: string;
    contentLinks?: string;
    age: number;
    experience: number;
    profilePhoto?: {
        file?: any;
        fileList?: any;
    };
}

export type { profile_form_Schema }