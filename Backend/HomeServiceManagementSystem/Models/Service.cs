using System.ComponentModel.DataAnnotations;

namespace HomeServiceManagementSystem.Models
{
    public class Service
    {

        [Key]
        public int Id { get; set; }
        public required string Name { get; set; }
        public required double Price {  get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public required string Category {  get; set; }
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    }
}
