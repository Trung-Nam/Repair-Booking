using System.ComponentModel.DataAnnotations;
using HomeServiceManagementSystem.Models;

namespace HomeServiceManagementSystem.Dtos
{
    public class RegisterRequest
    {

        public required string Fullname { get; set; }
        [EmailAddress]
        public required string Email { get; set; }
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        public required string Password { get; set; }
        [Phone]
        public required string PhoneNumber { get; set; }
        public required Role Role { get; set; }

    }

    public class ChangePasswordRequest
    {
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        public required string CurrentPassword { get; set; }
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        public required string NewPassword { get; set; }
    }

    public class LoginRequest
    {
        [EmailAddress]
        public required string Email { get; set; } = string.Empty;

        [MinLength(6)]
        public required string Password { get; set; } = string.Empty;
    }

    public class LogoutRequest
    {
        public required string Token { get; set; } = string.Empty;
    }

    public class LoginResponse
    {
        public string Token { get; set; } = string.Empty;
        public string? Role { get; set; }
    }

    public class MyInfoResponse
    {
        public required int Id { get; set; }
        public required string Fullname { get; set; }
        public required string Email { get; set; }
        public required string PhoneNumber { get; set; }
        public required Role Role { get; set; }
        public required bool Status { get; set; }
    }

    public class UpdateProfileRequest
    {
        public string? Fullname { get; set; }
        [EmailAddress]
        public string? Email { get; set; }
        [Phone]
        public string? PhoneNumber { get; set; }
    }

    public class UserFilter
    {
        public string? Keyword { get; set; }
        public int? Field { get; set; }
        public required int PageNumber { get; set; }
        public required int PageSize { get; set; }
    }
}
