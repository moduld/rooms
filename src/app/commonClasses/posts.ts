/**
 * Created by user on 13.04.17.
 */
interface MediaInside {
    created_at: any;
    id: number;
    multimedia: string;
    post_id: number;
    thumbnail: number;
    type: number;
    updated_at: any;
}
interface Media {
    0: MediaInside[]
}
interface Owner {
    about: string;
    active: number;
    blocked_count: any;
    country: any;
    created_at: any;
    display_name: string;
    fans_count: number;
    faves_count: number;
    msg_from_anyone: any;
    multimedia: string;
    muted_count: any;
    posts_count: number;
    rooms_count: number;
    thumbnail: string;
    updated_at: any;
    user_id: number;
    user_name: string;
}

export class Post {
    comments_count: number;
    created_at: any;
    liked_by_user: number;
    likes_count: number;
    post_id: number;
    room_id: number;
    text: string;
    type: number;
    updated_at: any;
    user_id: number;
    wall_id: number;
    media: Media[];
    owner: Owner;
    includes?: any;
}