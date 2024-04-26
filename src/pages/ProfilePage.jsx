import { Outlet, useParams } from "react-router-dom";

export default function ProfilePage() {
    const params = useParams({profileId: String});
    return (
        <div>
            <div className="flex flex-col gap-4">
                <h2>Profile Page { params.profileId}</h2>
            </div>
        </div>
    )
}