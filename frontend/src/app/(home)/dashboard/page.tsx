"use client"

import { formatCurrency } from "@/libs/Date";
import { Category } from "@/props/Transaction";
import useAuthStore from "@/stores/auth-store";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function Dashboard() {
    const {token} = useAuthStore();
    const MySwal = withReactContent(Swal);
    const [data, setData] = useState({
        totalIncome: 0,
        totalExpense: 0,
        totalSaving: 0
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState({
        category: '',
        amount: 0,
        note: '',
        type: 'income'
    });

    useEffect(() => {
        axios.get('/baseapi/dashboard', {headers: {Authorization: `Bearer ${token}`}}).then((res) => {
            setData(res.data);
            setCategories(res.data.categories);
        });
    }, [token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setInput({...input, [e.target.name]: e.target.value});
    }

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(input.category === '' || input.amount === 0){
            MySwal.fire({
                title: 'Vui lòng điền đầy đủ thông tin',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }
        
        axios.post('/baseapi/transaction', {
            category: input.category,
            amount: input.amount,
            note: input.note,
            type: input.type
        }, {headers: {Authorization: `Bearer ${token}`}}).then(() => {
            MySwal.fire({
                title: 'Thêm giao dịch thành công',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            setInput({
                category: '',
                amount: 0,
                note: '',
                type: 'income'
            });
        });
    }

    return (  
        <div className="min-h-screen">
            <section className="2xl:flex-1 2xl:mb-0 mb-6">
                <div className="w-full mb-[24px]">
                    <div className="grid lg:grid-cols-3 grid-cols-1 gap-[24px]">
                        <div className="p-5 rounded-lg bg-white border border-bgray-300">
                            <div className="flex justify-between items-center mb-5">
                                <div className="flex space-x-[7px] items-center">
                                    <div className="icon">
                                        <span><Image src="/assets/images/total-earn.svg" alt="icon" width={44} height={38} /></span>
                                    </div>
                                    <span className="text-lg text-bgray-900 font-semibold">Tổng tiền thu</span>
                                </div>
                                <div><Image src="/assets/images/members-2.png" alt="members" width={48} height={25} /></div>
                            </div>
                            <div className="flex justify-between items-end">
                                <div className="flex-1">
                                    <p className="text-bgray-900 font-bold text-3xl leading-[48px]">
                                        {formatCurrency(data.totalIncome)}
                                    </p>
                                    
                                </div>
                            </div>
                        </div>
                        <div className="p-5 rounded-lg bg-white border border-bgray-300">
                            <div className="flex justify-between items-center mb-5">
                                <div className="flex space-x-[7px] items-center">
                                    <div className="icon">
                                        <span><Image src="/assets/images/total-earn.svg" alt="icon" width={44} height={38} /></span>
                                    </div>
                                    <span className="text-lg text-bgray-900 font-semibold">Tổng tiền chi</span>
                                </div>
                                <div><Image src="/assets/images/members-2.png" alt="members" width={48} height={25} /></div>
                            </div>
                            <div className="flex justify-between items-end">
                                <div className="flex-1">
                                    <p className="text-bgray-900 font-bold text-3xl leading-[48px]">
                                        {formatCurrency(data.totalExpense)}
                                    </p>
                                    
                                </div>
                            </div>
                        </div>
                        <div className="p-5 rounded-lg bg-white border border-bgray-300">
                            <div className="flex justify-between items-center mb-5">
                                <div className="flex space-x-[7px] items-center">
                                    <div className="icon">
                                        <span><Image src="/assets/images/total-earn.svg" alt="icon" width={44} height={38} /></span>
                                    </div>
                                    <span className="text-lg text-bgray-900 font-semibold">Tổng tiền tiết kiệm</span>
                                </div>
                                <div><Image src="/assets/images/members-2.png" alt="members" width={48} height={25} /></div>
                            </div>
                            <div className="flex justify-between items-end">
                                <div className="flex-1">
                                    <p className="text-bgray-900 font-bold text-3xl leading-[48px]">
                                        {formatCurrency(data.totalSaving)}
                                    </p>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full flex flex-col lg:flex-row 2xl:space-x-0 2xl:flex-col lg:space-x-6 space-x-0 border border-bgray-300">
                <div className="w-full lg:max-w-[600px] mx-auto rounded-lg bg-white px-[42px] py-5 2xl:mb-6 lg:mb-0 mb-6">
                    <form className="w-full" onSubmit={onSubmit}>
                        <h3 className="text-lg font-bold text-bgray-900 mb-4">
                            Thêm giao dịch
                        </h3>
                        <div className="payment-select relative mb-3">
                            <button type="button" className="px-5 w-full mb-4 h-[56px] border border-bgray-200 flex justify-between items-center rounded-lg overflow-hidden" onClick={() => setIsOpen(!isOpen)}>
                                <div className="flex space-x-2 items-center">
                                    <span className="text-sm font-medium text-bgray-900">
                                        {input.category === '' ? 'Chọn thể loại' : input.category}
                                    </span>
                                </div>
                                <div className="flex space-x-2 items-center">
                                    <span className="text-sm font-medium text-bgray-900">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 6L8 10L12 6" stroke="#A0AEC0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                    </span>
                                </div>
                            </button>
                            <div className={`rounded-lg shadow-lg w-full bg-white dark:bg-darkblack-500 absolute right-0 z-10 top-full overflow-hidden ${isOpen ? 'block' : 'hidden'}`}>
                                <ul>
                                    {categories.map((category) => (
                                        <li key={category.id} className="text-sm  text-bgray-90 cursor-pointer px-5 py-2 hover:bg-bgray-100 font-semibold" onClick={() => {setInput({...input, category: category.name}); setIsOpen(false)}}>
                                            {category.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="mb-4">
                                <select className="text-bgray-800 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:outline-none focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base" name="type" value={input.type} onChange={handleChange}>
                                    <option value="income">Thu</option>
                                    <option value="expense">Chi</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <input type="number" className="text-bgray-800 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:outline-none focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base" placeholder="Nhập số tiền" name="amount" value={input.amount} onChange={handleChange} />
                            </div>
                            <div className="mb-4">  
                                <input type="text" className="text-bgray-800 text-base border border-bgray-300 h-20 w-full focus:border-success-300 focus:outline-none focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base" placeholder="Nhập ghi chú(nếu có)" name="note" value={input.note} onChange={handleChange} />
                            </div>
                        <button type="submit" className="py-3.5 flex items-center justify-center text-white font-bold bg-success-300 hover:bg-success-400 transition-all rounded-lg w-full">
                            Thêm
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}

export default Dashboard;