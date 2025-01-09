"use client"
import DropDown from "@/components/DropDown";
import { formatCurrency, formatDate } from "@/libs/Date";
import type { Category, Transaction } from "@/props/Transaction";
import useAuthStore from "@/stores/auth-store";
import axios from "axios";
import { useEffect, useState } from "react";

function TransactionPage() {
    const {token} = useAuthStore();
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectedItemsAmount, setSelectedItemsAmount] = useState<number[]>([]);
    const [selectedItemsDate, setSelectedItemsDate] = useState<number[]>([]);
    const [selectedItemsCategory, setSelectedItemsCategory] = useState<number[]>([]);

    const handleToggleDropdown = (dropdownName: string) => {
        if (activeDropdown === dropdownName) {
          setActiveDropdown(null);
        } else {
          setActiveDropdown(dropdownName);
        }
    };
    
    useEffect(() => {
        if(token) {
            const fetchTransactions = async () => {
                await axios.get('/baseapi/transaction', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }).then(res => {
                    setData(res.data.transactions);
                    setCategories(res.data.categories);
                    setIsLoading(false);
                }).catch(() => {
                    setData([]);
                    setCategories([]);
                });
            }
    
            fetchTransactions();
        }
    }, [token]);

    if(isLoading) {
        return <div>Loading...</div>;
    }

    const optionsType =[
        {
            id: 0,
            name: 'Tất cả loại giao dịch'   
        },
        {
            id: 1,
            name: 'Thu nhập'
        },
        {
            id: 2,
            name: 'Chi tiêu'
        }
    ];

    const optionsAmount = [
        {
            id: 1,
            name: '> 0đ'
        },
        {
            id: 2,
            name: '> 100.000đ'
        },
        {
            id: 3,
            name: '> 500.000đ'
        },
        {
            id: 4,
            name: '> 1.000.000đ'
        }
    ];

    return (  
        <div className="2xl:flex 2xl:space-x-[48px]">
            <section className="2xl:flex-1 2xl:mb-0 mb-6">
                <div className="w-full py-[20px] px-[24px] rounded-lg bg-white">
                    <div className="flex flex-col space-y-5">
                        <div className="w-full flex h-[56px] space-x-4">
                            <div className="lg:w-[88%] sm:w-[70%] sm:block hidden border border-transparent focus-within:border-success-300 h-full bg-bgray-100 rounded-lg px-[18px]">
                                <div className="flex w-full h-full items-center space-x-[15px]">
                                <span>
                                    <svg className="stroke-bgray-900" width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="9.80204" cy="10.6761" r="8.98856" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></circle>
                                    <path d="M16.0537 17.3945L19.5777 20.9094" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </svg>
                                </span>
                                <label htmlFor="listSearch" className="w-full">
                                    <input type="text" id="listSearch" placeholder="Tìm kiếm giao dịch..." className="search-input w-full bg-bgray-100 border-none px-0 focus:outline-none focus:ring-0 text-sm placeholder:text-sm text-bgray-600 tracking-wide placeholder:font-medium placeholder:text-bgray-500" />
                                </label>
                                </div>
                            </div>
                            <div className="flex-1 h-full relative">
                                <button type="button" className="w-full h-full flex justify-center items-center bg-bgray-100 border border-bgray-300 rounded-lg">
                                <div className="flex space-x-3 items-center">
                                    <span>
                                    <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.55169 13.5022H1.25098" stroke="#0CAF60" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        <path d="M10.3623 3.80984H16.663" stroke="#0CAF60" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M5.94797 3.75568C5.94797 2.46002 4.88981 1.40942 3.58482 1.40942C2.27984 1.40942 1.22168 2.46002 1.22168 3.75568C1.22168 5.05133 2.27984 6.10193 3.58482 6.10193C4.88981 6.10193 5.94797 5.05133 5.94797 3.75568Z" stroke="#0CAF60" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M17.2214 13.4632C17.2214 12.1675 16.1641 11.1169 14.8591 11.1169C13.5533 11.1169 12.4951 12.1675 12.4951 13.4632C12.4951 14.7589 13.5533 15.8095 14.8591 15.8095C16.1641 15.8095 17.2214 14.7589 17.2214 13.4632Z" stroke="#0CAF60" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </svg>
                                    </span>
                                    <span className="text-base text-success-300 font-medium">Tìm</span>
                                </div>
                                </button>
                            </div>
                        </div>
                        <div className="filter-content w-full">
                            <div className="grid lg:grid-cols-4 grid-cols-1 gap-4">
                                <DropDown 
                                    title="Loại giao dịch" 
                                    placeholder="Tất cả loại giao dịch" 
                                    isActive={activeDropdown === 'type'}
                                    options={optionsType}
                                    onToggle={() =>handleToggleDropdown('type')}
                                    selectedItems={selectedItems}
                                    setSelectedItems={setSelectedItems}
                                />
                                <DropDown 
                                    title="Số tiền chi tiêu" 
                                    placeholder="> 0đ"
                                    isActive={activeDropdown === 'amount'}
                                    options={optionsAmount}
                                    onToggle={() => handleToggleDropdown('amount')}
                                    selectedItems={selectedItemsAmount}
                                    setSelectedItems={setSelectedItemsAmount}
                                />
                                <DropDown 
                                    title="Ngày" 
                                    placeholder="Chọn ngày" 
                                    type="date"
                                    isActive={activeDropdown === 'date'}
                                    onToggle={() => handleToggleDropdown('date')}
                                    selectedItems={selectedItemsDate}
                                    setSelectedItems={setSelectedItemsDate}
                                />
                                <DropDown 
                                    title="Thể loại" 
                                    placeholder="Tất cả thể loại"
                                    isActive={activeDropdown === 'category'}
                                    options={categories}
                                    onToggle={() => handleToggleDropdown('category')}
                                    selectedItems={selectedItemsCategory}
                                    setSelectedItems={setSelectedItemsCategory}
                                />
                            </div>
                        </div>
                        <div className="table-content w-full overflow-x-auto">
                            <table className="w-full">
                                <tbody>
                                    <tr className="border-b border-bgray-300">
                                        <td className="py-5 px-6 xl:px-0 w-[250px] lg:w-auto inline-block">
                                            <div className="w-full flex space-x-2.5 items-center">
                                                <span className="text-base font-medium text-bgray-600">Thể loại</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6 xl:px-0">
                                            <div className="w-full flex space-x-2.5 items-center">
                                                <span className="text-base font-medium text-bgray-600">Nội dung</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6 xl:px-0">
                                            <div className="flex space-x-2.5 items-center">
                                                <span className="text-base font-medium text-bgray-600">Ngày</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6 xl:px-0 w-[165px]">
                                            <div className="w-full flex space-x-2.5 items-center">
                                                <span className="text-base font-medium text-bgray-600">Tiền</span>
                                            </div>
                                        </td>
                                    </tr>
                                    {data.map((item) => (
                                        <tr className="border-b border-bgray-300" key={item.id}>
                                            <td className="py-5 px-6 xl:px-0">
                                                <p className="font-medium text-base text-bgray-900 dark:text-bgray-50">
                                                    {item.category.name}
                                                </p>
                                            </td>
                                            <td className="py-5 px-6 xl:px-0">
                                                <p className="font-medium text-base text-bgray-900 dark:text-bgray-50">
                                                    {item.description}
                                                </p>
                                            </td>
                                            <td className="py-5 px-6 xl:px-0">
                                                <p className="font-medium text-base text-bgray-900 dark:text-bgray-50">
                                                    {formatDate(item.date)}
                                                </p>
                                            </td>
                                            <td className="py-5 px-6 xl:px-0">
                                                <p className="font-medium text-base text-bgray-900 dark:text-bgray-50">
                                                    {item.type == 'expense' ? '-' : '+'} {formatCurrency(item.amount)}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default TransactionPage;