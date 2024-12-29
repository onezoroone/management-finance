"use client"
import Sidebar from "@/components/Sidebar";

function Dashboard() {
    return (  
        <div className="w-full layout-wrapper active">
            <div className="w-full flex relative">
                <Sidebar />
            </div>
        </div>
    );
}

export default Dashboard;