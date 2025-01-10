"use client"
import React, { useEffect } from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import axios from "axios";
import useAuthStore from "@/stores/auth-store";

function Analytics() {
    const {token} = useAuthStore();
    useEffect(() => {
        // Hàm để lấy token khách từ backend
        if(token){
            const fetchGuestTokenFromBackend = async () => {
                const response = await axios.get('/baseapi/get-guest-token',{
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                return response.data;
            };
    
            // Nhúng dashboard Superset
            const mountPoint = document.getElementById("my-superset-container");
            if (mountPoint) {
                embedDashboard({
                    id: "15cf2ffe-712d-4a9a-b6d4-86cdb8129bad",
                    supersetDomain: "https://superset.63httt2.site",
                    mountPoint: mountPoint,
                    fetchGuestToken: fetchGuestTokenFromBackend,
                    dashboardUiConfig: { hideTitle: true },
                }).catch((error) => {
                    console.error("Error embedding Superset dashboard:", error);
                });
            }
        }
    }, [token]);

    return (
        <div id="my-superset-container" className="min-h-screen">
        </div>
    );
}

export default Analytics;
