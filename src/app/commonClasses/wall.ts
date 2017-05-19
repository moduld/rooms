/**
 * Created by user on 13.04.17.
 */
interface Membership {
    admin: number;
    member: number;
    moderator: number;
    room_id: any;
    talker: number;
    user_id: any;
}
interface RoomDetails {
    color: string;
    country: any;
    created_at: string;
    language: any;
    locality: any;
    members_count: number;
    multimedia: any;
    num_visits: number;
    public: number;
    room_alias: string;
    room_desc: string;
    room_id: number;
    room_name: string;
    searchable_flag: number;
    thumbnail: any;
    updated_at: string;
    user_id: number;
    walls_count: number;
}
interface Walls {
    allow_comment_flag: number;
    allow_post_flag: number;
    room_id: number;
    wall_id: number;
    wall_level: number;
    wall_name: string;
}

export class Wall {
    membership: Membership;
    room_details: RoomDetails;
    walls: Walls[];
    is_admin?: boolean;
    flag?: string;
}