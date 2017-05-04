interface UserData {
    about: any;
    active: number;
    blocked_count: number;
    country: any;
    created_at: string;
    display_name: string;
    fans_count: number;
    faves_count: number;
    msg_from_anyone: number;
    multimedia: any;
    muted_count: number;
    posts_count: number;
    rooms_count: number;
    thumbnail: any;
    updated_at: string;
    user_id: any;
    user_name: string;
}

export class UserInfo {
    token: string;
    user_data: UserData;
}