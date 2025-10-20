import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';

const ErrorBoundary = () => {
    const error = useRouteError();
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="mb-6">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                        <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {error?.status === 404 ? 'Trang không tìm thấy' : 'Đã xảy ra lỗi'}
                    </h1>
                    <p className="text-gray-600 mb-6">
                        {error?.status === 404
                            ? 'Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.'
                            : 'Xin lỗi, đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.'
                        }
                    </p>

                    {error?.status && (
                        <div className="bg-gray-100 rounded-lg p-4 mb-6">
                            <p className="text-sm text-gray-700">
                                <strong>Mã lỗi:</strong> {error.status}
                            </p>
                            {error.statusText && (
                                <p className="text-sm text-gray-700">
                                    <strong>Thông báo:</strong> {error.statusText}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={handleGoBack}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Quay lại
                    </button>
                    <button
                        onClick={handleGoHome}
                        className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                    >
                        Về trang chủ
                    </button>
                </div>

                {process.env.NODE_ENV === 'development' && error && (
                    <details className="mt-6 text-left">
                        <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                            Chi tiết lỗi (Development)
                        </summary>
                        <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto">
                            {JSON.stringify(error, null, 2)}
                        </pre>
                    </details>
                )}
            </div>
        </div>
    );
};

export default ErrorBoundary;
