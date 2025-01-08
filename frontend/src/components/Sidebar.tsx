/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { BarChart, Goal, History, House, MessagesSquare, Wallet, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface SidebarProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
    const pathname = usePathname();
    useEffect(() => {
        setOpen(false);
    }, [pathname]);
    const itemsMenu = [
        {
            title: "Tổng quan",
            icon: <House />,
            link: '/dashboard'
        },
        {
            title: "Lịch sử giao dịch",
            icon: <History />,
            link: "/transaction"
        },
        {
            title: "Thống kê",
            icon: <BarChart />,
            link: "/analytics"
        },
        {
            title: "Ví của tôi",
            icon: <Wallet />,
            link: "/wallet"
        },
        {
            title: "Mục tiêu",
            icon: <Goal />,
            link: '/goals'
        },
        {
            title: "Chatbot",
            icon: <MessagesSquare />,
            link: "/chatbot"
        },
        {
            title: "Thông báo qua Telegram",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-telegram" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09"/>
          </svg>,
            link: "/telegram"
        },
    ];
    return (  
        <>
        {open && <div onClick={() => setOpen(!open)} className="fixed inset-0 z-40 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"></div>}
        <aside className={`fixed inset-y-0 left-0 z-50 ${open ? 'p-6 shadow-lg' : ''} w-4/5 sm:w-14 flex-col border-r bg-background duration-300 transition-transform ease-in-out ${open ? 'transform-none' : '-translate-x-full'} sm:translate-x-0`}>
            <nav className="sm:flex flex-col items-center sm:gap-4 px-2 sm:py-5 grid gap-6 max-sm:text-lg max-sm:font-medium">
                <Link className="group w-20 h-20 flex sm:h-9 sm:w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground md:text-base" href="#">
                    <Image width={12} height={12} src="/tlu.svg" className="h-full w-full transition-all group-hover:scale-110" alt="Logo" />
                </Link>
                {itemsMenu.map((item, index) => (
                <Link key={index} title={item.title} className={`flex max-sm:gap-4 px-2 sm:h-9 sm:w-9 items-center sm:justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${pathname == item.link ? ' bg-accent text-black py-2' : ''}`} data-state="closed" href={item.link}>
                    {item.icon}
                    <span className={`${open ? 'block' : 'hidden'} sm:hidden`}>{item.title}</span>
                </Link>
                ))}
            </nav> 
            {open && <button onClick={() => setOpen(!open)} type="button" className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                <X />
                <span className="sr-only">Close</span>
            </button>}
        </aside>
        </>
    );
}

export default Sidebar;