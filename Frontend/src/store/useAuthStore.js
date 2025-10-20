import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';

const useAuthStore = create(
    persist(
        (set, get) => ({
            // State
            user: null,
            token: null,
            role: null,
            isLoggedIn: false,

            // Actions
            login: async (credentials) => {
                try {
                    const response = await axiosInstance.post('/auth/login', credentials);
                    if (response.data.code === 1000) {
                        // Set token first to use in subsequent API calls
                        set({
                            token: response.data.result.token,
                            role: response.data.result.role,
                            isLoggedIn: true
                        });

                        // Call /auth/me to get user profile information
                        try {
                            const profileResponse = await axiosInstance.get('/auth/me');

                            if (profileResponse.data.code === 1000) {
                                // Convert role to number format for consistency
                                const roleMap = {
                                    'CUSTOMER': 0,
                                    'ADMIN': 1,
                                    'EMPLOYEE': 2,
                                    0: 0,
                                    1: 1,
                                    2: 2
                                };

                                const normalizedRole = roleMap[profileResponse.data.result.role] || 0;

                                // Update store with user information
                                const userInfo = {
                                    ...profileResponse.data.result,
                                    role: normalizedRole
                                };

                                set({
                                    user: userInfo,
                                    token: response.data.result.token,
                                    role: normalizedRole,
                                    isLoggedIn: true
                                });

                                toast.success(`Chào mừng ${profileResponse.data.result.fullname}!`, {
                                    position: "top-right",
                                    autoClose: 3000,
                                });

                                return { success: true, user: profileResponse.data.result };
                            } else {
                                throw new Error('Failed to get user profile');
                            }
                        } catch (profileError) {
                            // If profile fetch fails, still return success but without user info
                            toast.success('Đăng nhập thành công!', {
                                position: "top-right",
                                autoClose: 3000,
                            });
                            return { success: true, user: null };
                        }
                    } else if (response.data.code === 1002) {
                        throw new Error('Mật khẩu hoặc email không đúng!');
                    } else if (response.data.code === 1009) {
                        throw new Error('Tài khoản bị khóa hoặc không có quyền truy cập.');
                    } else {
                        throw new Error(response.data.message || 'Đăng nhập thất bại!');
                    }
                } catch (error) {
                    let errorMessage = 'Đăng nhập thất bại';

                    // Priority 1: Check if error has a message (from throw statements above)
                    if (error.message && !error.response) {
                        errorMessage = error.message;
                    }
                    // Priority 2: Check API response message
                    else if (error.response?.data?.message) {
                        errorMessage = error.response.data.message;
                    }
                    // Priority 3: Check response code
                    else if (error.response?.data?.code) {
                        const code = error.response.data.code;
                        if (code === 1002) {
                            errorMessage = 'Mật khẩu hoặc email không đúng!';
                        } else if (code === 1009) {
                            errorMessage = 'Tài khoản bị khóa hoặc không có quyền truy cập.';
                        } else if (code === 1001) {
                            errorMessage = 'Email không tồn tại trong hệ thống.';
                        }
                    }
                    // Priority 4: Check HTTP status codes
                    else if (error.response?.status === 401) {
                        errorMessage = 'Mật khẩu hoặc email không đúng!';
                    } else if (error.response?.status === 403) {
                        errorMessage = 'Tài khoản bị khóa hoặc không có quyền truy cập.';
                    } else if (error.response?.status === 404) {
                        errorMessage = 'Tài khoản không tồn tại.';
                    } else if (error.response?.status === 500) {
                        errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau.';
                    }

                    toast.error(errorMessage, {
                        position: "top-right",
                        autoClose: 3000,
                    });

                    throw new Error(errorMessage);
                }
            },

            register: async (userData) => {
                try {
                    // Format data according to API structure
                    const apiData = {
                        fullname: userData.name,
                        email: userData.email,
                        password: userData.password,
                        phoneNumber: userData.phone,
                        role: 0 // Default role is customer (0)
                    };

                    const response = await axiosInstance.post('/auth/register', apiData);

                    if (response.data.code === 1000) {
                        toast.success('Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.', {
                            position: "top-right",
                            autoClose: 3000,
                        });
                        return { success: true };
                    } else {
                        throw new Error('Đăng ký thất bại');
                    }
                } catch (error) {
                    let errorMessage = 'Đăng ký thất bại';

                    if (error.response?.data?.message) {
                        errorMessage = error.response.data.message;
                    } else if (error.response?.status === 400) {
                        errorMessage = 'Dữ liệu đăng ký không hợp lệ.';
                    } else if (error.response?.status === 409) {
                        errorMessage = 'Email đã được sử dụng.';
                    } else if (error.response?.status === 500) {
                        errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau.';
                    }

                    throw new Error(errorMessage);
                }
            },

            logout: async () => {
                try {
                    const token = get().token;
                    if (token) {
                        // Call logout API with token as query parameter
                        await axiosInstance.post(`/auth/logout`, {
                            token: token
                        });
                    }
                } catch (error) {
                    // Continue with logout even if API call fails
                }

                set({
                    user: null,
                    token: null,
                    role: null,
                    isLoggedIn: false
                });
                toast.info('Đã đăng xuất thành công!', {
                    position: "top-right",
                    autoClose: 2000,
                });
            },

            setUser: (user) => {
                set({
                    user,
                    role: user.role,
                    isLoggedIn: true
                });
            },

            updateUser: (updatedUser) => {
                const currentUser = get().user;
                const mappedUser = {
                    ...currentUser,
                    fullname: updatedUser.fullname || currentUser.fullname,
                    email: updatedUser.email || currentUser.email,
                    phoneNumber: updatedUser.phoneNumber || currentUser.phoneNumber
                };
                set({
                    user: mappedUser
                });
            },

            // Helper functions
            isAdmin: () => get().role === 1,
            isEmployee: () => get().role === 2,
            isCustomer: () => get().role === 0,

            getRoleName: () => {
                const role = get().role;
                switch (role) {
                    case 0: return 'Khách hàng';
                    case 1: return 'Quản trị viên';
                    case 2: return 'Nhân viên';
                    default: return 'Chưa xác định';
                }
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                role: state.role,
                isLoggedIn: state.isLoggedIn
            })
        }
    )
);

export default useAuthStore;
