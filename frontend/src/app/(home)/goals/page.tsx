"use client"
import { formatCurrency, formatDate } from "@/libs/Date";
import { Goal } from "@/props/Transaction";
import useAuthStore from "@/stores/auth-store";
import axios from "axios";
import { List, ListCheck, ListTodoIcon, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function renderStatus(goal: Goal){
    if(goal.current_amount >= goal.target_amount){
        return <span className="badge rounded-full capitalize hover:top-0 relative my-1 px-2 py-[.125rem] text-[.75rem] font-semibold border border-success text-success">Đã đạt</span>
    }else if(goal.deadline < new Date().toISOString()){
        return <span className="badge rounded-full capitalize hover:top-0 relative my-1 px-2 py-[.125rem text-[.75rem] font-semibold border border-red-600 text-red-600">Hết hạn</span>
    }else{
        return <span className="badge rounded-full capitalize hover:top-0 relative my-1 px-2 py-[.125rem] text-[.75rem] font-semibold border border-warning text-warning">Đang chạy</span>
    }
}

function GoalPage() {
    const {token} = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [input, setInput] = useState<{name: string, target_amount: number, deadline: string}>({name: '', target_amount: 0, deadline: ''});
    const mySwal = withReactContent(Swal);
    // Lấy danh sách mục tiêu
    useEffect(() => {
        if(token){
            const fetchGoals = async () => {
                axios.get('/baseapi/goals',{
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then((res) => {
                    setGoals(res.data);
                });
            }
            fetchGoals();
        }
    }, [token]);

    const handleAddGoal = async () => {
        if(input.name === '' || input.target_amount === 0 || input.deadline === ''){
            mySwal.fire({
                title: 'Vui lòng điền đầy đủ thông tin',
                icon: 'error',
            });
            return;
        }
        // loading
        mySwal.fire({
            title: 'Đang thêm mục tiêu',
            text: 'Vui lòng đợi trong giây lát',
            icon: 'info',
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false
        });
        await axios.post('/baseapi/goal', {
            name: input.name,
            target_amount: input.target_amount,
            deadline: input.deadline
        },{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((res) => {
            setGoals([...goals, res.data.goal]);
            setIsOpenModal(false);
            setInput({name: '', target_amount: 0, deadline: ''});
            mySwal.fire({
                title: 'Thêm mục tiêu thành công',
                icon: 'success',
                text: res.data.message,
            });
        });
    }

    const handleOpenModal = () => {
        setIsOpenModal(!isOpenModal);
    }

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput({...input, [e.target.name]: e.target.value});
    }

    return (  
        <div>
            <div className="flex gap-5 relative sm:h-[calc(100vh_-_150px)] h-screen">
                <div className={`bg-white rounded-md p-4 flex-none w-[240px] max-w-full absolute xl:relative z-10 space-y-4 xl:h-auto h-full xl:block xl:rounded-r-md rounded-r-none ${isOpen ? "block" : 'hidden'}`}>
                    <div className="flex flex-col h-full pb-16">
                        <div className="pb-5">
                            <div className="flex text-center items-center">
                                <div className="shrink-0">
                                    <ListTodoIcon />
                                </div>
                                <h3 className="text-lg font-semibold ml-3">Mục tiêu</h3>
                            </div>
                        </div>
                        <div className="h-px w-full border-b border-white-light mb-5"></div>
                        <div className="scrollbar-container relative pl-3.5 -ml-3.5 h-full grow ps">
                            <div className="space-y-1">
                                <button type="button" className="w-full flex justify-between items-center p-2 hover:bg-[#888ea81a] rounded-md hover:text-primary font-medium h-10 bg-gray-100 text-primary">
                                    <div className="flex items-center">
                                        <ListCheck />
                                        <div className="ml-3">Danh sách</div>
                                    </div>
                                </button>
                            </div>
                            <div className="h-px w-full border-b border-white-light mb-5"></div>
                            <div className="px-1 py-3">Thẻ</div>
                            <button type="button" className="w-full flex items-center h-10 p-1 hover:bg-white-dark/10 rounded-md font-medium text-success hover:pl-3 duration-300 transition-all">
                                <svg width="15" height="15" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-[#00ab55] shrink-0"><path d="M8.01731 8.01736C11.3506 4.68402 13.0173 3.01736 15.0884 3.01736C17.1594 3.01736 18.8261 4.68402 22.1594 8.01736C25.4927 11.3507 27.1595 13.0174 27.1594 15.0884C27.1594 17.1595 25.4928 18.8262 22.1594 22.1595C18.8261 25.4928 17.1594 27.1595 15.0884 27.1594C13.0173 27.1595 11.3506 25.4928 8.01731 22.1595C4.68397 18.8262 3.01731 17.1595 3.01734 15.0884C3.01729 13.0174 4.68401 11.3507 8.01731 8.01736Z" stroke="currentColor" strokeWidth="1.5"></path></svg>
                                <div className="ml-3">Đã đạt được</div>
                            </button>
                            <button type="button" className="w-full flex items-center h-10 p-1 hover:bg-white-dark/10 rounded-md font-medium text-warning hover:pl-3 duration-300 transition-all">
                                <svg width="15" height="15" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-[#e2a03f] shrink-0"><path d="M8.01731 8.01736C11.3506 4.68402 13.0173 3.01736 15.0884 3.01736C17.1594 3.01736 18.8261 4.68402 22.1594 8.01736C25.4927 11.3507 27.1595 13.0174 27.1594 15.0884C27.1594 17.1595 25.4928 18.8262 22.1594 22.1595C18.8261 25.4928 17.1594 27.1595 15.0884 27.1594C13.0173 27.1595 11.3506 25.4928 8.01731 22.1595C4.68397 18.8262 3.01731 17.1595 3.01734 15.0884C3.01729 13.0174 4.68401 11.3507 8.01731 8.01736Z" stroke="currentColor" strokeWidth="1.5"></path></svg>
                                <div className="ml-3">Đang chạy</div>
                            </button>
                            <button type="button" className="w-full flex items-center h-10 p-1 hover:bg-white-dark/10 rounded-md font-medium text-[#e7515a] hover:pl-3 duration-300 transition-all">
                                <svg width="15" height="15" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-[#e7515a] shrink-0"><path d="M8.01731 8.01736C11.3506 4.68402 13.0173 3.01736 15.0884 3.01736C17.1594 3.01736 18.8261 4.68402 22.1594 8.01736C25.4927 11.3507 27.1595 13.0174 27.1594 15.0884C27.1594 17.1595 25.4928 18.8262 22.1594 22.1595C18.8261 25.4928 17.1594 27.1595 15.0884 27.1594C13.0173 27.1595 11.3506 25.4928 8.01731 22.1595C4.68397 18.8262 3.01731 17.1595 3.01734 15.0884C3.01729 13.0174 4.68401 11.3507 8.01731 8.01736Z" stroke="currentColor" strokeWidth="1.5"></path></svg>
                                <div className="ml-3">Hết hạn</div>
                            </button>
                        </div>
                        <div className="left-0 absolute bottom-0 p-4 w-full">
                            <button onClick={handleOpenModal} className="btn bg-success-300 relative transition-all duration-300 rounded-[.375rem] px-[1.25rem] py-[.5rem] hover:bg-success-400 text-white flex items-center justify-center w-full" type="button">
                                <Plus />
                                Thêm Mới
                            </button>
                        </div>
                    </div>
                </div>
                <div className={`overlay bg-black/60 z-[5] w-full h-full rounded-md absolute ${isOpen ? "block" : 'hidden'} xl:!hidden`} onClick={() => setIsOpen(!isOpen)}></div>
                <div className="bg-white rounded-md p-0 flex-1 overflow-auto h-full">
                    <div className="flex flex-col h-full">
                        <div className="p-4 flex sm:flex-row flex-col w-full sm:items-center gap-4">
                            <div className="mr-3 flex items-center">
                                <button className="xl:hidden hover:text-primary block mr-3" onClick={() => setIsOpen(!isOpen)}>
                                    <List />
                                </button>
                            </div>
                        </div>
                        <div className="h-px w-full border-b border-white-light"></div>
                        <div className="overflow-x-auto relative overflow-y-auto grow max-w-full h-full sm:min-h-[300px] min-h-[400px]">
                            <table className="table-hover w-full relative">
                                <tbody>
                                    {goals.map((item) => (
                                    <tr className="group cursor-pointer " key={item.id}>
                                        <td className="w-1"><input type="checkbox" className="form-checkbox" /></td>
                                        <td>
                                            <div className="group-hover:text-primary font-semibold text-base whitespace-nowrap">{item.name}</div>
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-end space-x-2">
                                                <button type="button" className="align-middle">
                                                    {renderStatus(item)}
                                                </button>
                                            </div>
                                        </td>
                                        <td><p className="whitespace-nowrap text-white-dark font-medium">{formatCurrency(item.target_amount)}</p></td>
                                        <td><p className="whitespace-nowrap text-white-dark font-medium">{formatCurrency(item.current_amount)}</p></td>
                                        <td><p className="whitespace-nowrap text-white-dark font-medium">{formatDate(item.deadline)}</p></td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {isOpenModal && <div className="modal fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
                    <div className="modal-overlay absolute inset-0 bg-gray-500 opacity-75"></div>
                    <div className="modal-content flex justify-center w-full px-4 items-center mx-auto">
                        <div className="step-content step-1">
                            <div className="max-w-[550px] rounded-lg bg-white p-8 pb-10 transition-all relative">
                                <button onClick={handleOpenModal} className="flex justify-center items-center absolute top-6 right-6">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.9492 7.05029L7.04972 16.9498" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                        <path d="M7.0498 7.05029L16.9493 16.9498" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </svg>
                                </button>
                                <header className="py-6 text-center px-8">
                                    <h3 className="text-2xl font-bold text-bgray-900 mb-3">Thêm mục tiêu</h3>
                                    <p className="text-sm font-medium text-bgray-600">
                                        Vui lòng điền đầy đủ thông tin mục tiêu như tên, số tiền và ngày hết hạn
                                    </p>
                                </header>
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-base font-bold text-bgray-900">Loại ví</h4>
                                </div>
                                <div className="flex flex-col justify-between gap-5">
                                    <div className="mb-2">
                                        <label htmlFor="name" className="text-bgray-900 text-base font-semibold">Tên</label>
                                        <input type="text" className="text-bgray-800 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:outline-none focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base" placeholder="Tên" name="name" value={input.name} onChange={handleChangeInput} />
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="target_amount" className="text-bgray-900 text-base font-semibold">Số tiền</label>
                                        <input type="number" className="text-bgray-800 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:outline-none focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base" placeholder="Số tiền" name="target_amount" value={input.target_amount} onChange={handleChangeInput} />
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="deadline" className="text-bgray-900 text-base font-semibold">Ngày hết hạn</label>
                                        <input type="date" className="text-bgray-800 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:outline-none focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base" placeholder="Ngày" name="deadline" value={input.deadline} onChange={handleChangeInput} />
                                    </div>
                                </div>
                                <button onClick={handleAddGoal} className="bg-success-300 hover:bg-success-400 text-white font-semibold text-base py-4 flex justify-center items-center rounded-lg w-full mt-7">
                                    Thêm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>}
        </div>
    );
}

export default GoalPage;