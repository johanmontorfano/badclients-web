import { toast as htoast } from "react-hot-toast";

export function toast(title: string) {
    htoast.success(title);
}
