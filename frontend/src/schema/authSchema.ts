interface AuthSessionData {
    id: string,
    email: string,
    message: string,
    role: string
}

interface UserStatus {
    stage1: boolean,
    stage2: boolean,
    stage3: boolean,
    review1_stage: boolean,
    review2_stage: boolean,
    review3_stage: boolean,
    earlyVideoUploaded: boolean,
    prof_speech_stage: boolean,
    curr_speech_stage: boolean,
    allVideosComplete: boolean,
    sentforapproval: boolean,
    approvedByAdmin: number,
    rejectionCount: number
}

interface sessionState {
    init: () => Promise<void>,
    session: AuthSessionData | null
}

export type { AuthSessionData, sessionState, UserStatus }