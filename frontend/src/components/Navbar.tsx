/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useGetUserQuery, useLogoutMutation } from "@/redux/features/api/userSlice";
import {
    LogOutIcon,
    UserIcon,
} from "lucide-react"
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Navbar = () => {

    const { data } = useGetUserQuery(undefined);
    const user = data?.data;

    const navigate = useNavigate();
    const [logoutMutation, { isLoading: mutationLoading }] = useLogoutMutation();

    const profileImageUrl = user?.profile ? user?.profile : "https://github.com/shadcn.png"

    const handleLogout = async () => {
        try {
            await logoutMutation({}).unwrap()
            toast.success("Logout successfully");
            navigate('/login', { replace: true });
        } catch (err: any) {
            const message = err?.data?.message || "Something went wrong";
            toast.error(message);
        }
    };

    return (
        <div className='w-full h-15 px-8 py-5 border-b flex items-center justify-between'>
            <h1 className='font-bold text-lg capitalize'>Authentication</h1>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                        <AvatarImage src={profileImageUrl} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="end">
                    <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
                        <UserIcon />
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" variant="destructive" onClick={handleLogout}>
                        <LogOutIcon />
                        {mutationLoading ? 'Loading...' : 'Logout'}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default Navbar;
