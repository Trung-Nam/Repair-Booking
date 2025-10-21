using System.ComponentModel.DataAnnotations;

namespace RepairBookingManagementSystem.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public required string Fullname { get; set; }
        [EmailAddress]
        public required string Email { get; set; }
        public required string Password { get; set; }
        [Phone]
        public required string PhoneNumber { get; set; }
        public required Role Role { get; set; }
        public required bool Status { get; set; }
        public ICollection<Booking> CustomerBookings { get; set; } = new List<Booking>();
        public ICollection<Booking> EmployeeBookings { get; set; } = new List<Booking>();
    }

    public enum Role
    {
        CUSTOMER, ADMIN, EMPLOYEE
    }
}
