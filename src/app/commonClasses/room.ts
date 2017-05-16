/**
 * Created by user on 13.04.17.
 */
interface RoomInfo{
    color: string;
    members_count: number;
    multimedia: any;
    visits_count: number;
    public: number;
    room_alias: string;
    room_desc: string;
    room_id: number;
    room_name: string;
    searchable_flag: number;
    thumbnail: any;
    user_id: number;
}

export class Room {
    admin: number;
    member: number;
    moderator: number;
    pinned: number;
    room_id: number;
    talker: number;
    user_id: string;
    room: RoomInfo

}