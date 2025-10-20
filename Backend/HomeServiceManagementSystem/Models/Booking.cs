using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HomeServiceManagementSystem.Models
{
    public class Booking
    {

        [Key]
        public int Id { get; set; }
        [ForeignKey(nameof(Customer))]
        public int CustomerId { get; set; }
        [ForeignKey(nameof(Employee))]
        public int? EmployeeId {  get; set; }
        [ForeignKey(nameof(Service))]
        public int ServiceId { get; set;}
        public required DateTime HireAt {  get; set; }
        public required string Address {  get; set; }
        public string? Note { get; set; }
        public required BookingStatus Status { get; set; }   
        public User? Customer { get; set; } = null;
        public Service? Service { get; set; } = null;
        public User? Employee { get; set; } = null;

    }

    public enum BookingStatus { PENDING, ACCEPTED, COMPLETED, CANCELLED }
}
