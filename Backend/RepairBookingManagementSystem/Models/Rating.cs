using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RepairBookingManagementSystem.Models
{
    public class Rating
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("Booking")]
        public int BookingId { get; set; }
        [Range(1,5)]
        public int Rate { get; set; }
        public string? Comment { get; set; }
        public required Booking Booking { get; set; }
    }
}
