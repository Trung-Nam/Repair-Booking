namespace HomeServiceManagementSystem.Exceptions
{
    public class AppException : Exception
    {
        public ErrorCode ErrorCode { get; }
        public AppException(ErrorCode errorCode) : base(errorCode.Message()) => ErrorCode = errorCode;
    }

    public enum ErrorCode
    {
        UNKOWN = 9999,
        PHONE_NUMBER_EXISTED = 1001,
        INVALID_CREDENTIAL = 1002,
        USER_NOT_FOUND = 1003,
        EMAIL_EXISTED = 1004,
        PRICE_INVALID = 1005,
        SERVICE_NOT_FOUND = 1006,
        BOOKING_NOT_FOUND = 1007,
        INVALID_BOOKING_STATUS = 1008,
        ACCOUNT_NOT_ACTIVE = 1009,
    }

    public static class ErrorCodeInfo
    {
        public static string Message(this ErrorCode code) => code switch
        {
            ErrorCode.UNKOWN => "Unkown Exception",
            ErrorCode.PHONE_NUMBER_EXISTED => "Phone number has been existed",
            ErrorCode.INVALID_CREDENTIAL => "Password or username is wrong",
            ErrorCode.USER_NOT_FOUND => "User not found",
            ErrorCode.EMAIL_EXISTED => "Email has been existed",
            ErrorCode.PRICE_INVALID => "Price must be greater or equal to 0",
            ErrorCode.SERVICE_NOT_FOUND => "Service not found",
            ErrorCode.BOOKING_NOT_FOUND => "Booking not found",
            ErrorCode.INVALID_BOOKING_STATUS => "Booking status invalid",
            ErrorCode.ACCOUNT_NOT_ACTIVE => "Account not active",
        };
    }
}
