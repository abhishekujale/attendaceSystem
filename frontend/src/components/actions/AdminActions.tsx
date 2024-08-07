import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useRecoilState, useSetRecoilState } from "recoil";
import { editAdminSheet } from "../../store/sheetAtom";
import disabledAtom from "../../store/disabledAtom";
import { toast } from "react-toastify";
import adminsAtom from "../../store/adminsAtom";
import axios from "axios";
import { confrimationDialog } from "../../store/dialogAtom"; // Fixed typo

type AdminActionsProps = {
    id: string;
    email: string;
};

const AdminActions = ({
    id,
    email,
}: AdminActionsProps) => {
    const setAdmins = useSetRecoilState(adminsAtom);
    const setConfirmDialogue = useSetRecoilState(confrimationDialog);
    const [disabled, setDisabled] = useRecoilState(disabledAtom);
    const setEditAdminSheetState = useSetRecoilState(editAdminSheet);

    const deleteAdmin = async () => {
        try {
            setDisabled(true);
            const token = localStorage.getItem("authToken");
            if (!token) {
                toast.error("No token found");
                return;
            }

            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response?.data.success) {
                setAdmins((prev) => prev.filter((admin) => admin.id !== id));
                toast.success(response?.data.message);
            } else {
                toast.error(response?.data.message);
            }
        } catch (err: any) {
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Something went wrong!");
            }
        } finally {
            setDisabled(false); // Set loading to false
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button
                    variant={'ghost'}
                    className="p-0 size-8"
                >
                    <MoreHorizontal />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem
                    disabled={disabled}
                    onClick={() => {
                        setEditAdminSheetState({
                            isOpen: true,
                            id,
                            values: {
                                email ,
                                password:''
                            }
                        });
                    }}
                >
                    <Edit className="size-4 mr-2" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                    disabled={disabled}
                    onClick={() => {
                        setConfirmDialogue((prev) => ({
                            ...prev,
                            primaryAction: deleteAdmin,
                            isOpen: true,
                            title: "Are you sure?",
                            message: "Delete this admin"
                        }));
                    }}
                >
                    <Trash className="size-4 mr-2" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default AdminActions;
